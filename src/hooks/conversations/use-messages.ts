/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { v7 as uuid } from "uuid";

import {
  createTextMessage,
  fetchChatHistory,
  receiveChatSystemStream,
} from "@/api/messages";
import { usePageContext } from "@/context/page-context";
import type { TextMessage, TMessage } from "@/types/conversations";

export const useMessages = (conversationId: string | undefined) => {
  const messageHistory = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam }) => fetchChatHistory({ pageParam }),
    initialPageParam: `/zbot/conversations/${conversationId}/history/?limit=10&start=0`,
    getNextPageParam: (lastPage) => lastPage.links.next,
    getPreviousPageParam: (lastPage) => lastPage.links.previous,

    enabled: !!conversationId,
    refetchOnWindowFocus: false,
  });

  return messageHistory;
};

type InfiniteMessagesData = {
  pages: {
    results: TMessage[];
    // optionally other fields...
  }[];
  pageParams: any[]; // or a more specific type if you have it
};

export const useSendMessage = (
  conversationId: string | undefined,
  machine: string,
) => {
  const queryClient = useQueryClient();
  const { setAiResponsePending } = usePageContext();
  const [responseLoading, setResponseLoading] = useState<boolean>(false);

  const addMessageToHistory = useCallback(
    (message: TMessage) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: InfiniteMessagesData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                results: [...oldData.pages[0].results, message],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    },
    [queryClient, conversationId],
  );
  const updateLastAIMessageInHistory = useCallback(
    (data: string, id: string) => {
      queryClient.setQueryData(
        ["messages", conversationId],
        (oldData: InfiniteMessagesData) => {
          if (!oldData) return oldData;

          const lastMessage: TMessage = {
            ...oldData.pages[0].results[oldData.pages[0].results.length - 1],
          };

          lastMessage.id = id;
          lastMessage.data = `${lastMessage.data}${data}`;

          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                results: [
                  ...oldData.pages[0].results.slice(0, -1),
                  lastMessage,
                ],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    },
    [queryClient, conversationId],
  );

  const stream_mutation = useMutation({
    mutationFn: receiveChatSystemStream,
    onSuccess: (reader) => {
      setResponseLoading(true);
      setAiResponsePending(true);
      const newMessage: TextMessage = {
        id: uuid(),
        data: "",
        sender: "ai",
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        type: "text",
      };

      addMessageToHistory(newMessage);
      async function read(id: string) {
        const { done, value } = await reader.read();

        if (done) {
          setResponseLoading(false);
          setAiResponsePending(false);
          return;
        }

        const text = new TextDecoder("utf-8").decode(value);

        if (text.includes('{"text": ')) {
          const obj = JSON.parse(text);
          updateLastAIMessageInHistory(obj.text.text, obj.text.id);
        } else if (text.includes("data : ")) {
          const texts: string[] = text
            .split("data : ")
            .filter((t) => !!t)
            .map((t) => t.replace(/\n{2}$/, ""));

          for (const text of texts) {
            updateLastAIMessageInHistory(text, id);
          }
        }
        read(id);
      }
      read(newMessage.id);
    },
  });

  const send_mutation = useMutation({
    mutationFn: createTextMessage,
    onSuccess: (newMessage) => {
      // add message to history
      addMessageToHistory(newMessage);

      if (conversationId)
        stream_mutation.mutate({
          conversationId,
          textQuery: { id: newMessage.id, text: newMessage.data },
          machineType: machine,
        });
    },
  });

  return { send_mutation, stream_mutation, responseLoading };
};

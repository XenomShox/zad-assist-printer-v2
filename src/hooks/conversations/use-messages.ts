/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createTextMessage, fetchChatHistory } from "@/api/messages";

export const useMessages = (conversationId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam }) => fetchChatHistory({ pageParam }),
    initialPageParam: `/zbot/conversations/${conversationId}/history/?limit=10&start=0`,
    getNextPageParam: (lastPage) => lastPage.links.next,
    getPreviousPageParam: (lastPage) => lastPage.links.previous,

    enabled: !!conversationId,
  });
};

export const useCreateTextMessage = (conversationId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTextMessage,
    onSuccess: (newMessage) => {
      // Get current pages from the infinite query
      queryClient.setQueryData(["messages", conversationId], (oldData: any) => {
        if (!oldData) return oldData;

        console.log(oldData);
        console.log("useCreateTextMessage - newMessage", newMessage);

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              results: [...oldData.pages[0].results, newMessage],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
};

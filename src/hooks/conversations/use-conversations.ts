/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createConversation,
  deleteConversation,
  fetchConversation,
  fetchConversations,
} from "@/api/conversations";

export const useConversations = (type: "base" | "parameter") => {
  return useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: ({ pageParam }) => fetchConversations({ type, pageParam }),
    initialPageParam: "/zbot/conversations/",
    getNextPageParam: (lastPage) => lastPage.links.next,
    getPreviousPageParam: (lastPage) => lastPage.links.previous,
  });
};

export const useConversation = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => fetchConversation({ conversationId: conversationId! }),
    enabled: !!conversationId,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      // Get current pages from the infinite query
      queryClient.setQueryData(["conversations"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              results: [newConversation, ...oldData.pages[0].results],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      // Optimistically remove from cached conversations
      queryClient.setQueryData(["conversations"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            results: page.results.filter(
              (convo: any) => convo.id !== conversationId,
            ),
          })),
        };
      });
    },
  });
};

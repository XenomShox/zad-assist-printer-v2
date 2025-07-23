/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  createConversation,
  deleteConversation,
  editConversation,
  fetchConversation,
  fetchConversations,
} from "@/api/conversations";
import type { TConversationType } from "@/types/conversations";

export const useConversations = (type: TConversationType, search: string) => {
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["conversations", type, search],
    queryFn: ({ pageParam }) => fetchConversations({ type, search, pageParam }),
    initialPageParam: "/zbot/conversations/",
    getNextPageParam: (lastPage) => lastPage.links.next,
    getPreviousPageParam: (lastPage) => lastPage.links.previous,
  });

  return {
    ...infiniteQuery,
    data: infiniteQuery.data?.pages.flatMap((p) => p.results),
  };
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
  const navigate = useNavigate();

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
      navigate(`/d/c/${newConversation.id}`);
    },
    onError: () => {
      toast.error("Uh Oh!", {
        description: "We were unable to create a new conversation",
      });
    },
  });
};

export const useEditConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      newTitle,
      newName,
      newType,
    }: {
      conversationId: string;
      newTitle: string;
      newName: string;
      newType: TConversationType;
    }) => editConversation(conversationId, newTitle, newName, newType),
    onSuccess: () => {
      // Optimistically remove from cached conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Title edited", {
        description: "Title has succesfuly been edited",
      });
    },
    onError: () => {
      toast.error("Uh Oh!", {
        description: "We were unable to remove the conversation",
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
    onError: () => {
      toast.error("Uh Oh!", {
        description: "We were unable to remove the conversation",
      });
    },
  });
};

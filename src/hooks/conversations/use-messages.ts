import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchChatHistory } from "@/api/messages";

export const useMessages = (conversationId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam }) => fetchChatHistory({ pageParam }),
    initialPageParam: `/zbot/conversations/${conversationId}/history/?limit=10&start=10`,
    getNextPageParam: (lastPage) => lastPage.links.next,
    getPreviousPageParam: (lastPage) => lastPage.links.previous,

    enabled: !!conversationId,
  });
};

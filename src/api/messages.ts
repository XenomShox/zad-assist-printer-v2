// import { v7 as uuid } from "uuid";

import type { TLinks, TMessage } from "@/lib/conversations";

import { api } from ".";

export const fetchChatHistory = async ({
  pageParam,
}: {
  pageParam: string;
}): Promise<{
  results: TMessage[];
  count: number;
  links: TLinks;
}> => {
  const response = await api.get(pageParam);
  return response.data;
};

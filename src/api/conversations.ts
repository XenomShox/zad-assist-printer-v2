import { v7 as uuid } from "uuid";

import type { TConversation, TLinks } from "@/lib/conversations";

import { api } from ".";

export const fetchConversations = async ({
  type,
  pageParam,
}: {
  type: "base" | "parameter";
  pageParam: string;
}): Promise<{
  results: TConversation[];
  count: number;
  links: TLinks;
}> => {
  const response = await api.get(pageParam, {
    params: { limit: 30, is_deleted: false, type },
  });
  return response.data;
};

export const fetchConversation = async ({
  conversationId,
}: {
  conversationId: string;
}): Promise<{
  results: TConversation;
  count: number;
  links: TLinks;
}> => {
  const response = await api.get(`/zbot/conversations/${conversationId}/`);
  return response.data;
};

export const createConversation = async (payload: Partial<TConversation>) => {
  const response = await api.post(`/zbot/conversations/`, {
    ...payload,
    name: `${payload.title}-${uuid()}`,
  });
  return response.data as TConversation;
};

export const deleteConversation = async (conversationId: string) => {
  const res = await api.delete(`/zbot/conversations/${conversationId}/`);

  console.log(res.data);
  return res.data;
};

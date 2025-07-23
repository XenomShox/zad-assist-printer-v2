import { v7 as uuid } from "uuid";

import type {
  TConversation,
  TConversationType,
  TLinks,
} from "@/types/conversations";

import { api } from ".";

export const fetchConversations = async ({
  type,
  search,
  pageParam,
}: {
  type: TConversationType;
  search: string;
  pageParam: string;
}): Promise<{
  results: TConversation[];
  count: number;
  links: TLinks;
}> => {
  const response = await api.get(pageParam, {
    params: { limit: 30, is_deleted: false, type, title__contains: search },
  });
  return response.data;
};

export const fetchConversation = async ({
  conversationId,
}: {
  conversationId: string;
}): Promise<TConversation> => {
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

export const editConversation = async (
  conversationId: string,
  title: string,
  name: string,
  type: TConversationType,
) => {
  const res = await api.put(`/zbot/conversations/${conversationId}/`, {
    type,
    name,
    title,
  });
  return res.data;
};

export const deleteConversation = async (conversationId: string) => {
  const res = await api.delete(`/zbot/conversations/${conversationId}/`);
  return res.data;
};

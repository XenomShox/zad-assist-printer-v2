// import { v7 as uuid } from "uuid";

import type {
  TextMessage,
  TLinks,
  TMessage,
  TSenderEnum,
} from "@/types/conversations";

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

  const { links, count, results } = response.data;

  const messages: TMessage[] = results.reverse().map((m: TMessage) => {
    if (m.type === "image") {
      const image_description = m.image_description
        ? m.image_description
        : null;
      const image_utility =
        !m.image_utility || m.image_utility === "None" ? null : m.image_utility;

      return {
        ...m,
        image_description,
        image_utility,
      };
    } else return m;
  });

  //   console.log(messages)

  return { links, count, results: messages };
};

interface createTextMessageProps {
  conversationId: string;
  text: string;
  sender?: TSenderEnum;
  machine: string;
}

export const createTextMessage = async ({
  conversationId,
  text,
  sender = "user",
  machine,
}: createTextMessageProps): Promise<TMessage> => {
  const response = await api.post(
    `/zbot/conversations/${conversationId}/textMessages/`,
    {
      text: text.trim(),
      machine,
      sender,
    },
  );

  const { text: textData, ...rest } = response.data;

  const new_message: TextMessage = { ...rest, type: "text", data: textData };

  return new_message;
};

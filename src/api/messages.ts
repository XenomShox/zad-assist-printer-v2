// import { v7 as uuid } from "uuid";

import type {
  ImageMessage,
  TextMessage,
  TLinks,
  TMessage,
  TSenderEnum,
} from "@/types/conversations";

import { api, API_BASE_URL, APP_VERSION } from ".";

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
  image?: File;
  sender?: TSenderEnum;
  machine: string;
}

export const sendMessages = async ({
  conversationId,
  text,
  image,
  sender = "user",
  machine,
}: createTextMessageProps): Promise<{
  new_text_message: TMessage;
  new_image_message: TMessage | undefined;
}> => {
  let new_image_message: ImageMessage | undefined = undefined;

  if (image) {
    const formData = new FormData();
    formData.append("metadata", "");
    formData.append("image", image);
    formData.append("machine_model", machine);
    formData.append("sender", sender);

    const response = await api.post(
      `/zbot/conversations/${conversationId}/imageMessages/`,
      formData,
    );

    const { image_url: imageData, ...imageRest } = response.data;

    new_image_message = {
      ...imageRest,
      type: "image",
      data: imageData,
    };
  }

  const text_msg_response = await api.post(
    `/zbot/conversations/${conversationId}/textMessages/`,
    {
      text: text.trim(),
      machine,
      sender,
    },
  );

  const { text: textData, ...textRest } = text_msg_response.data;

  const new_text_message: TextMessage = {
    ...textRest,
    type: "text",
    data: textData,
  };

  return { new_text_message, new_image_message };
};

interface receiveChatSystemStreamProps {
  conversationId: string;
  textQuery: { id: string; text: string };
  imageQuery?: { id: string; image_url: string };
  machineType: string;
}

export const receiveChatSystemStream = async ({
  conversationId,
  textQuery,
  imageQuery,
  machineType,
}: receiveChatSystemStreamProps) => {
  const body = {
    textQuery,
    machineType,
    appVersion: APP_VERSION,
    imageQuery,
  };

  const token = localStorage.getItem("zad-assist-jwt-access");

  const response = await fetch(
    `${API_BASE_URL}/zbot/conversations/${conversationId}/streamsse/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.body) throw new Error("Stream not supported by browser");

  const reader = response.body.getReader();

  return reader;
};

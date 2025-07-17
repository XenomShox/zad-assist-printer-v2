// import { useChatContext } from "@/context/ChatContext";
import type { TMessage } from "@/types/conversations";

import ChatAIMessage from "./chat-ai-message";
import ChatUserMessage from "./chat-user-message";

interface ChatMessageBlockProps {
  messages: TMessage[];
}
const ChatMessageBlock = ({ messages }: ChatMessageBlockProps) => {
  //   const { conversation } = useChatContext();

  //   console.log(conversation.data?.type);
  return (
    <div className="flex w-full flex-col gap-2">
      {messages.map((message, idx) =>
        message.sender === "user" ? (
          <ChatUserMessage
            key={`user-${message.id}`}
            idx={idx}
            message={message}
          />
        ) : (
          message.sender === "ai" && (
            <ChatAIMessage
              key={`ai-${message.id}`}
              idx={idx}
              message={message}
            />
            // <div>some ai message</div>
          )
        ),
      )}
    </div>
  );
};

export default ChatMessageBlock;

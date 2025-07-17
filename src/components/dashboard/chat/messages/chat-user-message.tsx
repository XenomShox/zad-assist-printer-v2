import Markdown from "react-markdown";

import UserAvatar from "@/components/user-avatar";
import { useChatContext } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import type { TMessage } from "@/types/conversations";

interface ChatUserMessageProps {
  message: TMessage;
  idx: number;
}
const ChatUserMessage = ({ message, idx }: ChatUserMessageProps) => {
  const { conversation } = useChatContext();
  return (
    <div
      className={cn(
        "bg-accent flex w-fit gap-4 self-end rounded-lg p-2 sm:p-3",
        {
          "items-center": message.type === "text" && message.data?.length < 100,
          "items-center border border-neutral-300 py-1 sm:py-2":
            conversation.data?.type === "parameter",
        },
      )}
    >
      {idx === 0 && <UserAvatar />}

      {message.type === "text" && (
        <div
          className={cn("prose dark:prose-invert", {
            "text-sm": conversation.data?.type === "parameter",
          })}
        >
          <Markdown>{message.data}</Markdown>
        </div>
      )}

      {/* {message.type === "parameter" && (
        <ParameterMessage title={message.data} formParams={formParams} />
      )} */}

      {message.type === "image" && (
        <img
          className="max-h-72 rounded-xl"
          src={message.data}
          alt={`${message.id}`}
        />
      )}
    </div>
  );
};

export default ChatUserMessage;

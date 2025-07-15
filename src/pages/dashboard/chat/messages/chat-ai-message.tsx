import Markdown from "react-markdown";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useChatContext } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import type { TMessage } from "@/types/conversations";

import AIImageMessage from "./chat-ai-image-message";

interface ChatAIMessageProps {
  message: TMessage;
  idx: number;
}
const ChatAIMessage = ({ message, idx }: ChatAIMessageProps) => {
  const { conversation } = useChatContext();
  return (
    <div className={cn("flex w-full flex-col gap-8 self-start rounded-3xl")}>
      {idx === 0 && (
        <div className={cn("flex flex-col gap-6")}>
          <Avatar>
            <AvatarImage src="/chat/zbot-logo.svg" alt="ai avatar" />
            <AvatarFallback className="uppercase">AI</AvatarFallback>
          </Avatar>
          <Separator className="bg-accent h-[2px]" />
        </div>
      )}

      {message.type == "text" && (
        <div
          className={cn(
            // "bg-accent text-accent w-2/3 rounded-3xl border-2 border-[rgb(237,237,237)] p-4",
            "prose dark:prose-invert w-2/3 max-w-2/3 rounded-3xl p-4",
            {
              "bg-neutral-50 text-sm": conversation.data?.type === "parameter",
            },
          )}
        >
          <Markdown
          // className={cn("max-w-full", {
          //   "text-sm": conversation.data?.type === "parameter",
          // })}
          >
            {message.data}
          </Markdown>
        </div>
      )}
      {message.type == "image" && (
        <div className="flex flex-col gap-2">
          {message.data && (
            <AIImageMessage id={message.id} data={message.data} />
          )}
          {message.image_utility && (
            <div
              className={cn(
                "prose dark:prose-invert w-fit rounded-3xl border-2 border-neutral-200 bg-white p-4",
                {
                  "bg-neutral-50 text-sm":
                    conversation.data?.type === "parameter",
                },
              )}
            >
              <Markdown
              // className={cn("prose dark:prose-invert", {
              //   "text-sm": conversation.data?.type === "parameter",
              // })}
              >
                {message.image_utility}
              </Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatAIMessage;

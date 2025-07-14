// import { ScrollArea } from "@/components/ui/scroll-area";

import ChatHeroTitle from "@/components/dashboard/chat/chat-hero-title";
import type { TMessage } from "@/types/conversations";

import ChatMessageBlock from "./chat-message-block";

interface ChatMessagesProps {
  message_blocks: TMessage[][];
}

const ChatMessages = ({ message_blocks }: ChatMessagesProps) => {
  return (
    <div className="relative mb-32 h-full w-full">
      {message_blocks.length <= 0 && (
        <div className="flex h-[80vh] w-full items-center justify-center">
          <ChatHeroTitle />
        </div>
      )}
      <div className="flex w-full flex-col gap-2 px-4">
        {message_blocks.map((messages, idx) => (
          <ChatMessageBlock key={`message-block-${idx}`} messages={messages} />
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;

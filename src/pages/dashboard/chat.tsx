import { useParams } from "react-router";

import ChatHeroTitle from "@/components/dashboard/chat/chat-hero-title";
import { useConversation } from "@/hooks/conversations/use-conversations";
import { useMessages } from "@/hooks/conversations/use-messages";
import type { TMessage } from "@/lib/conversations";

const groupMessages = (messages: TMessage[]): TMessage[][] => {
  if (messages.length === 0) return [];

  const result: TMessage[][] = [];
  let currentBlock: TMessage[] = [messages[0]];

  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender === messages[i - 1].sender) {
      currentBlock.push(messages[i]);
    } else {
      result.push(currentBlock);
      currentBlock = [messages[i]];
    }
  }

  result.push(currentBlock);
  return result;
};

const Chat = () => {
  const { conversationId } = useParams();

  const { data: conversation_data } = useConversation(conversationId);

  const { data: messages_data } = useMessages(conversationId);

  const message_blocks = groupMessages(
    messages_data?.pages.flatMap((page) => page.results) ?? [],
  );

  console.log(conversation_data, message_blocks);
  return (
    <section className="flex h-[calc(100vh-4rem)] flex-1 flex-col justify-center gap-4 overflow-y-hidden">
      <ChatHeroTitle />
    </section>
  );
};

export default Chat;

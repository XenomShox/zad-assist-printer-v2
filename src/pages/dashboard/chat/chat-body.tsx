import { useCallback, useEffect, useRef, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatContext } from "@/context/ChatContext";
import useScrollDetection from "@/hooks/use-scroll-detection";
import type { TMessage } from "@/types/conversations";

import ChatForm from "./chat-form";
import ChatMessages from "./messages/chat-messages";
import ChatNewMessagesLoading from "./messages/chat-new-messages-loading";

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

const ChatBody = () => {
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);

  const { conversation, messages } = useChatContext();
  const { data: conversationData, isLoading: isConversationLoading } =
    conversation;
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = messages;
  //   const chatBodyRef = useRef<HTMLDivElement | null>(null);

  //   message blocks to pass to ChatMessages component
  const message_blocks: TMessage[][] = groupMessages(
    messagesData?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.results) ?? [],
  );

  //   console.log(messages.data);

  //   to define bottom scroll
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 500);
  }, [conversationData?.id]);

  //   to change the tab title
  useEffect(() => {
    if (conversationData?.title)
      document.title = `${conversationData.title}...`;
    else document.title = "zbot chat";
  }, [conversationData?.title]);

  //   handling scroll to top page loading
  const handleTopScroll = useCallback(async () => {
    if (
      !isConversationLoading &&
      !isMessagesLoading &&
      messagesData?.pages[messagesData.pages.length - 1].links.next
    ) {
      // Dispatch fetching for more messages
      fetchNextPage();
    }
  }, [isConversationLoading, fetchNextPage, isMessagesLoading, messagesData]);

  const chatBodyRef = useScrollDetection({
    onTop: handleTopScroll,
  });

  useEffect(() => {
    const currentContainer = chatBodyRef.current;
    if (
      !isFetchingNextPage &&
      currentContainer &&
      messagesData?.pages[messagesData.pages.length - 1].links.next
    ) {
      currentContainer.scrollTo({
        top: 150, // Small offset from the top
        behavior: "smooth",
      });
    }
  }, [isFetchingNextPage, chatBodyRef, messagesData?.pages]);

  useEffect(() => {
    const currentContainer = chatBodyRef.current;

    const updateScrollDistance = () => {
      if (currentContainer) {
        const { scrollTop, scrollHeight, clientHeight } = currentContainer;
        if (scrollTop + clientHeight + 200 <= scrollHeight) {
          if (!showScrollToBottom) setShowScrollToBottom(true);
        } else {
          if (showScrollToBottom) setShowScrollToBottom(false);
        }
        // else setShowScrollToBottom(false);
      }
    };
    if (currentContainer) {
      currentContainer.addEventListener("scroll", updateScrollDistance);
      updateScrollDistance();
    }

    return () => {
      if (currentContainer)
        currentContainer.removeEventListener("scroll", updateScrollDistance);
    };
  }, [chatBodyRef, showScrollToBottom]);

  //   console.log(conversation.data);
  //   console.log(messages.data);
  //   console.log(messages.data?.pages.flatMap((page) => page.results) ?? []);
  //   console.log(message_blocks);
  return (
    <ScrollArea
      viewportRef={chatBodyRef}
      className="relative h-[calc(100vh-4rem)]"
    >
      <ChatNewMessagesLoading isLoading={isFetchingNextPage} />
      <ChatMessages message_blocks={message_blocks} />
      <div ref={chatEndRef}></div>

      <ChatForm
        showScrollToBottom={showScrollToBottom}
        handleScrollToBottom={() => scrollToBottom()}
      />
    </ScrollArea>
  );
};

export default ChatBody;

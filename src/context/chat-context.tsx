import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";

import { useConversation } from "@/hooks/conversations/use-conversations";
import { useMessages } from "@/hooks/conversations/use-messages";
import type {
  TConversation,
  TConversationType,
  TLinks,
  TMessage,
} from "@/types/conversations";

export type TChatSize = "base" | "sm";

// Define the context type
interface ChatContextType {
  conversation: UseQueryResult<TConversation, Error>;

  messages: UseInfiniteQueryResult<
    InfiniteData<
      {
        results: TMessage[];
        count: number;
        links: TLinks;
      },
      unknown
    >,
    Error
  >;

  redirectTo: string;
  type: TConversationType;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

type TChatProviderProps = {
  conversationId: string;
  redirectTo: string;
  size?: TChatSize;

  children?: React.ReactNode;
  type: TConversationType;
};

// Provider component
export const ChatProvider = ({
  conversationId,
  redirectTo,

  children,
  type,
}: TChatProviderProps) => {
  const conversation = useConversation(conversationId);

  const messages = useMessages(conversationId);

  useEffect(() => {
    if (conversation.isError)
      toast.error("Uh oh! something went wrong.", {
        description: "Unable to retrieve conversation",
      });
    if (messages.isError)
      toast.error("Uh oh! something went wrong.", {
        description: "Unable to retrieve messages",
      });
  }, [conversation.isError, messages.isError]);

  return (
    <ChatContext.Provider
      value={{
        conversation,
        messages,

        redirectTo,
        type,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

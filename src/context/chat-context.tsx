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

  children: React.ReactNode;
  type: TConversationType;
};

// const groupMessages = (messages: TMessage[]): TMessage[][] => {
//   if (messages.length === 0) return [];

//   const result: TMessage[][] = [];
//   let currentBlock: TMessage[] = [messages[0]];

//   for (let i = 1; i < messages.length; i++) {
//     if (messages[i].sender === messages[i - 1].sender) {
//       currentBlock.push(messages[i]);
//     } else {
//       result.push(currentBlock);
//       currentBlock = [messages[i]];
//     }
//   }

//   result.push(currentBlock);
//   return result;
// };

// Provider component
export const ChatProvider = ({
  conversationId,
  redirectTo,

  children,
  type,
}: TChatProviderProps) => {
  //   const navigate = useNavigate();

  const conversation = useConversation(conversationId);

  const messages = useMessages(conversationId);

  //   const message_blocks = groupMessages(
  //     messages.data?.pages.flatMap((page) => page.results) ?? [],
  //   );

  //   console.log(conversation.data, message_blocks);

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

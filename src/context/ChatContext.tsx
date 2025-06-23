// import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// import {
//   clear_errors,
//   fetchMessagesV2,
//   TConversation,
//   TConversationType,
//   TParams,
// } from "@/store/conversationSlice";
// import { AppDispatch, RootState } from "@/store/store";

// export type TChatSize = "base" | "sm";

// // Define the context type
// interface ChatContextType {
//   conversation: TConversation;

//   messagesLoading: boolean;
//   messagesError: string | null;

//   messagesLinkLoading: boolean;
//   messagesLinkError: string | null;

//   isPendingAIResponse: { [conversationId: string]: boolean };

//   selectedParam: TParams | null;

//   redirectTo: string;
//   type: TConversationType;
// }

// // Create context
// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// type TChatProviderProps = {
//   conversationId: string;
//   redirectTo: string;
//   size?: TChatSize;

//   children: React.ReactNode;
//   type: TConversationType;
// };

// // Provider component
// export const ChatProvider = ({
//   conversationId,
//   redirectTo,

//   children,
//   type,
// }: TChatProviderProps) => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     conversations,

//     messagesLoading,
//     messagesError,

//     messagesLinkLoading,
//     messagesLinkError,

//     isPendingAIResponse,
//   } = useSelector((state: RootState) => state.conversations);

//   const conversation = useMemo(
//     () => conversations.find((c) => c.id === conversationId),
//     [conversations, conversationId],
//   );

//   const [selectedParam, setSelectedParam] = useState<TParams | null>(null);

//   useEffect(() => {
//     const fetchmessages = async () => {
//       if (conversation?.id) {
//         const resultAction = await dispatch(
//           fetchMessagesV2({ conversationId: conversation.id }),
//         );

//         // failure
//         if (fetchMessagesV2.rejected.match(resultAction)) navigate(redirectTo);
//       }
//     };
//     fetchmessages();
//   }, [navigate, dispatch, conversation?.id, redirectTo]);

//   useEffect(() => {
//     if (conversation?.params.length > 0)
//       setSelectedParam(conversation?.params[0]);
//     else setSelectedParam(null);
//   }, [conversation?.params]);

//   useEffect(() => {
//     if (messagesError)
//       toast.error("Uh oh! something went wrong.", {
//         description: messagesError,
//         onDismiss: () => dispatch(clear_errors()),
//         onAutoClose: () => dispatch(clear_errors()),
//       });
//   }, [dispatch, messagesError]);

//   return (
//     <ChatContext.Provider
//       value={{
//         conversation,

//         messagesLoading,
//         messagesError,

//         messagesLinkLoading,
//         messagesLinkError,

//         isPendingAIResponse,

//         selectedParam,

//         redirectTo,
//         type,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// // Custom hook for easy access
// // eslint-disable-next-line react-refresh/only-export-components
// export const useChatContext = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChatContext must be used within a ChatProvider");
//   }
//   return context;
// };

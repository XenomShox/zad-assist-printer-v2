import { useNavigate, useParams } from "react-router";

import ChatBody from "@/components/dashboard/chat/chat-body";
import { ChatProvider } from "@/context/chat-context";

const Chat = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  if (!conversationId) navigate("/d/c");

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-1 flex-col justify-center gap-4 overflow-y-hidden">
      <ChatProvider
        conversationId={conversationId!}
        redirectTo="/d/c"
        type="base"
      >
        <ChatBody />
      </ChatProvider>
    </section>
  );
};

export default Chat;

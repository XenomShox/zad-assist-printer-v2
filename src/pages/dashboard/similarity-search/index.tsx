import { useNavigate, useParams } from "react-router";

import { ChatProvider } from "@/context/chat-context";

const SimilaritySearchPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  if (!conversationId) navigate("/d/ss");

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-1 flex-col justify-center gap-4 overflow-y-hidden">
      <ChatProvider
        conversationId={conversationId!}
        redirectTo="/d/ss"
        type="base"
      >
        Similarity search page
      </ChatProvider>
    </section>
  );
};

export default SimilaritySearchPage;

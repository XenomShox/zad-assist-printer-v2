import { useNavigate, useParams } from "react-router";

import SimilaritySearchBody from "@/components/dashboard/similarity-search";

const SimilaritySearchPage = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  if (!conversationId) navigate("/d/ss");

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-1 flex-col justify-center gap-4 overflow-y-hidden p-4">
      <SimilaritySearchBody />
    </section>
  );
};

export default SimilaritySearchPage;

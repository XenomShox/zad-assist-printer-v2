import { SimilaritySearchProvider } from "@/context/similarity-search";

import Output from "./output";
import VideoInput from "./video-input";

const SimilaritySearchBody = () => {
  return (
    <div className="text-accent-foreground flex h-full max-h-[calc(100vh-6rem)] w-full items-stretch">
      <SimilaritySearchProvider>
        <VideoInput />
        <Output />
      </SimilaritySearchProvider>
    </div>
  );
};

export default SimilaritySearchBody;

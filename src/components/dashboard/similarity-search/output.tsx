import { ScrollArea } from "@/components/ui/scroll-area";
import { useSimilaritySearchContext } from "@/context/similarity-search";

const Output = () => {
  const { framePreviews } = useSimilaritySearchContext();
  return (
    <ScrollArea className="bg-accent flex h-full flex-1 flex-col rounded-lg">
      <div className="flex-1 p-4">
        {framePreviews.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {framePreviews.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Frame ${idx}`}
                className="w-32 rounded object-cover shadow"
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default Output;

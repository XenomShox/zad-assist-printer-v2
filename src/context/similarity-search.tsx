import { createContext, useContext, useState } from "react";

// Define the context type
interface SimilaritySearchType {
  framePreviews: string[];
  setFramePreviews: React.Dispatch<React.SetStateAction<string[]>>;

  isExtracting: boolean;
  setIsExtracting: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context
const SimilaritySearchContext = createContext<SimilaritySearchType | undefined>(
  undefined,
);

type SimilaritySearchProviderProps = {
  children: React.ReactNode;
};

// Provider component
export const SimilaritySearchProvider = ({
  children,
}: SimilaritySearchProviderProps) => {
  const [framePreviews, setFramePreviews] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  return (
    <SimilaritySearchContext.Provider
      value={{
        framePreviews,
        setFramePreviews,

        isExtracting,
        setIsExtracting,
      }}
    >
      {children}
    </SimilaritySearchContext.Provider>
  );
};

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useSimilaritySearchContext = () => {
  const context = useContext(SimilaritySearchContext);
  if (!context) {
    throw new Error(
      "useSimilaritySearchContext must be used within a SimilaritySearchProvider",
    );
  }
  return context;
};

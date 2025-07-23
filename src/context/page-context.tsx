import { createContext, useContext, useState } from "react";

import type { TConversationType } from "@/types/conversations";

// Define the context type
interface PageContextType {
  redirectPath: string;
  conversationType: TConversationType;

  aiResponsePending: boolean;
  setAiResponsePending: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context
const PageContext = createContext<PageContextType | undefined>(undefined);

type PageProviderProps = {
  redirectPath: string;
  conversationType: TConversationType;

  children: React.ReactNode;
};

// Provider component
export const PageProvider = ({
  redirectPath,
  conversationType,
  children,
}: PageProviderProps) => {
  const [aiResponsePending, setAiResponsePending] = useState<boolean>(false);
  return (
    <PageContext.Provider
      value={{
        redirectPath,
        conversationType,

        aiResponsePending,
        setAiResponsePending,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
};

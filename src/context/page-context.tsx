import { createContext, useContext } from "react";

import type { TConversationType } from "@/types/conversations";

// Define the context type
interface PageContextType {
  redirectPath: string;
  conversationType: TConversationType;
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
  return (
    <PageContext.Provider
      value={{
        redirectPath,
        conversationType,
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

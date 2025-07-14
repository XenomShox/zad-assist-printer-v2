import type { UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

import { useMachines } from "@/hooks/machines/use-machines";
import type { TMachine } from "@/types/machines";

// Define the context type
interface MachineContextType {
  machines: UseQueryResult<TMachine[], Error>;

  machine: string;
  setMachine: React.Dispatch<React.SetStateAction<string>>;
}

// Create context
const MachineContext = createContext<MachineContextType | undefined>(undefined);

type MachineProviderProps = {
  children: React.ReactNode;
};

// Provider component
export const MachineProvider = ({ children }: MachineProviderProps) => {
  const machines = useMachines();
  const [machine, setMachine] = useState<string>("");
  const [firstFetch, setFirstFetch] = useState<boolean>(false);

  useEffect(() => {
    if (machines.isFetched && !firstFetch) {
      setMachine(
        machines.data?.sort((a, b) => a.name.localeCompare(b.name))[0].id || "",
      );
      setFirstFetch(true);
    }
  }, [machines, firstFetch]);

  return (
    <MachineContext.Provider
      value={{
        machines,
        machine,

        setMachine,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useMachineContext = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

import { useQuery } from "@tanstack/react-query";

import { fetchMachines } from "@/api/machines";

export const useMachines = () => {
  return useQuery({
    queryKey: ["machines"],
    queryFn: () => fetchMachines(),
  });
};

// hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";

import { fetchCurrentUser } from "@/lib/auth";

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

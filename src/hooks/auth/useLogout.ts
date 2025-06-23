// hooks/useLogout.ts
import { useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/lib/auth";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    logoutUser();
    // queryClient.removeQueries({ queryKey: ["auth", "user"] });
    queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
  };
};

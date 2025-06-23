// hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { loginUser } from "@/lib/auth";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: (data) => {
      // refetch user query
      queryClient.setQueryData(["auth", "user"], data);
      navigate("/d/c");
    },
  });
};

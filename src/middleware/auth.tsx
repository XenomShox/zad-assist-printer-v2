import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router";

import PageFallback from "@/components/page-fallback";
import { useAuth } from "@/hooks/auth/useAuth";

const AuthMiddleware = ({ children }: { children?: ReactElement }) => {
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) return <PageFallback />;
  if (isError || !user) return <Navigate to="/login" />;

  return children || <Outlet />;
};

export default AuthMiddleware;

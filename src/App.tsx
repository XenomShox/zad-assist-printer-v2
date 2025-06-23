import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";

import AuthMiddleware from "./middleware/auth";

const LoginPage = lazy(() => import("@/pages/login"));

const DashboardLayout = lazy(
  () => import("@/pages/dashboard/dashboard-layout"),
);
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const ChatPage = lazy(() => import("@/pages/dashboard/chat"));
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/d/c" />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/d" element={<AuthMiddleware />}>
        <Route
          path="c"
          element={
            <DashboardLayout redirectPath="/d/c" conversationType="base" />
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path=":conversationId" element={<ChatPage />} />
        </Route>
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;

import { useEffect } from "react";

import Form from "@/components/login/form";
import Illustration from "@/components/login/illustration";

const LoginPage = () => {
  useEffect(() => {
    document.title = "Login";
  });
  return (
    <div className="relative z-0 flex h-screen overflow-hidden bg-white">
      <Illustration />
      <Form />
    </div>
  );
};

export default LoginPage;

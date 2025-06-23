import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";

import App from "./App";

const queryClient = new QueryClient();

const WebAppProviders = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="zad-assist-theme">
        <App />
        <Toaster richColors closeButton theme="light" />
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default WebAppProviders;

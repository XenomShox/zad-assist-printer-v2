import "./index.css";

import { createRoot } from "react-dom/client";

import WebAppProviders from "./WebAppProviders.tsx";

createRoot(document.getElementById("root")!).render(<WebAppProviders />);

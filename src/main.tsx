import React from "react";
import ReactDOM from "react-dom/client";
import "./Global.css";

import { App } from "./App";
import { AuthProvider } from "./Contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

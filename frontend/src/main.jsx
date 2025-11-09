import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AvatarProvider } from "./contexts/AvatarContext.jsx";

import React from "react";
import * as ReactDOM from "react-dom";

if (import.meta.env.MODE !== "production") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AvatarProvider>
      <App />
    </AvatarProvider>
  </StrictMode>
);

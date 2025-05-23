import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Routes from "./routes.js";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

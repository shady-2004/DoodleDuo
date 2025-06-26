import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Sketch from "./components/Sketch.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sketch />
  </StrictMode>
);

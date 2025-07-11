/* eslint-env node */

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL || ""),
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
  };
});

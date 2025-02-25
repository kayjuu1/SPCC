import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import EnvironmentPlugin from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react(), EnvironmentPlugin()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});

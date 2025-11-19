import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // ensure vite outputs in dist/
  },
  server: {
    port: 5173, // optional, for local dev
  }
});

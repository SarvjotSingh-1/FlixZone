import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    //   port: 3007, // Change this to your desired port number
    proxy: {
      "/api": {
        target: "http://localhost:5001",
      },
    },
  },
});

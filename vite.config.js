import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@layout": path.resolve(__dirname, "./src/layout"),
    },
  },
  server: {
    port: 5003,
    cors: true,
    fs: {
      allow: [".."],
    },
  },
  plugins: [
    react(),
    federation({
      name: "feedingMF",
      filename: "remoteEntry.js",
      exposes: {
        "./FeedingSchedule":
          "./src/features/feeding-schedule/components/FeedingSchedule.jsx",
        "./FeedingPlan":
          "./src/features/feeding-plan/components/FeedingPlan.jsx",
        "./FeedingEventsList":
          "./src/features/feeding-events/components/FeedingEventsList.jsx",
        "./FeedingStore": "./src/shared/store/feedingStore.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true },
        zustand: { singleton: true },
        axios: { singleton: true },
        "framer-motion": { singleton: true },
        "lucide-react": { singleton: true },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
  },
});

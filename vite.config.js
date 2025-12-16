import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
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
      shared: ["react", "react-dom", "react-router-dom", "zustand", "axios"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 5003,
    cors: true,
  },
});

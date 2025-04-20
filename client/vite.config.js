/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})


// /* eslint-disable no-undef */
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   test: {
//     // Enables Vitest testing
//     environment: "jsdom", // Simulates a browser environment
//     globals: true, // Enables global testing APIs (e.g., `describe`, `it`, `expect`)
//     setupFiles: "./test/setup.js", // Path to your test setup file
//   },
// });

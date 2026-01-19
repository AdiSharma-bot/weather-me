import { defineConfig } from "vite";

export default defineConfig({
    base: "/weather-me/",
    build: {
        outDir: "docs",
        emptyOutDir: true
    }
});
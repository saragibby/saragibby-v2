import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@payload-config": fileURLToPath(new URL("./src/payload.config.ts", import.meta.url)),
    },
  },
  test: { include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"], environment: "node" },
})

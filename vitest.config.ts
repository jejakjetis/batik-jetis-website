import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    // Modul "server-only" melempar error di luar Next; di test diganti stub kosong.
    alias: { "server-only": path.resolve(__dirname, "test/server-only-stub.ts") },
  },
});

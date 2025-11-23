import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: "cjs",
  outDir: "dist",
  bundle: true,
  minify: true,
  clean: true,
  external: ["typescript"],
});


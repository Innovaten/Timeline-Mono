import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["./src/index.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "@lexical"],
  banner: {
    js: "'use client'",
  },
  ...options,
}));

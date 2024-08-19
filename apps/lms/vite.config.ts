import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default ({ mode } : { mode: string}) => { 
  return defineConfig({
    plugins: [
      react(),
      TanStackRouterVite(),
    ],
    optimizeDeps: {
      exclude: [
        '@repo/config',
        '@repo/utils'
      ],
    }
  });
}

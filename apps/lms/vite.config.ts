import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import  commonjs from 'vite-plugin-commonjs'

export default ({ mode } : { mode: string}) => { 
  return defineConfig({
    plugins: [
      react(),
      TanStackRouterVite(),
      commonjs()
    ],
    optimizeDeps: {
      exclude: [
        '@repo/config',
        '@repo/utils'
      ],
    }
  });
}

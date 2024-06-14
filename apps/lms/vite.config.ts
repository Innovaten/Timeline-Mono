import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import  commonjs from 'vite-plugin-commonjs'

export default ({ mode } : { mode: string}) => { 
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    define: {
      'process.env': env
    },
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

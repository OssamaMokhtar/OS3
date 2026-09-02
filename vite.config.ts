import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No `define` block injecting the API key: Vite substitutes at build time,
// which would inline the literal key into the client bundle. The key lives
// server-side only (api/_lib/gemini.ts).
export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

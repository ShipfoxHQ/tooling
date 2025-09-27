import {defineConfig} from '@shipfox/vitest';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(
  {
    plugins: [react(), tailwindcss()],
    css: {},
    test: {
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      globalSetup: './test/global.ts',
    },
  },
  import.meta.url,
);

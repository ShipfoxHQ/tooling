import {resolve} from 'node:path';
import {defineConfig} from '@shipfox/vite';

export default defineConfig({
  optimizeDeps: {
    include: ['**'],
  },
  build: {
    ssr: resolve(__dirname, 'src/index.ts'),
    outDir: './dist',
    sourcemap: 'inline',
    commonjsOptions: {
      include: [/.*/],
    },
  },
  ssr: {
    noExternal: /.+/,
  },
});

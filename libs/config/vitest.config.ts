import {defineConfig} from '@shipfox/vitest';

export default defineConfig(
  {
    test: {
      globalSetup: './test/global.ts',
      setupFiles: ['./test/setup.ts'],
    },
  },
  import.meta.url,
);

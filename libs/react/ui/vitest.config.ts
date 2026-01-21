import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {argosVitestPlugin} from '@argos-ci/storybook/vitest-plugin';
import {defineConfig} from '@shipfox/vitest';
import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {playwright} from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(
  {
    plugins: [react(), tailwindcss()],
    css: {},
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({configDir: path.join(dirname, '.storybook')}),
            argosVitestPlugin({
              uploadToArgos: !!process.env.CI,
              token: process.env.ARGOS_TOKEN,
            }),
          ],
          test: {
            name: 'storybook',
            include: ['src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{browser: 'chromium'}],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'unit',
            include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
            exclude: ['**/*.stories.*', '**/node_modules/**', '**/dist/**'],
            environment: 'jsdom',
            setupFiles: ['./test/setup.ts'],
          },
        },
      ],
    },
  },
  import.meta.url,
);

import {resolve} from 'node:path';
import type {StorybookConfig} from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['storybook-addon-pseudo-states', '@storybook/addon-vitest'],
  viteFinal: (config) => {
    config.plugins = config.plugins ?? [];

    config.plugins.push(react(), tailwindcss());

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      components: resolve(__dirname, '../src/components'),
      hooks: resolve(__dirname, '../src/hooks'),
      utils: resolve(__dirname, '../src/utils'),
      state: resolve(__dirname, '../src/state'),
    };

    return config;
  },
};

export default config;

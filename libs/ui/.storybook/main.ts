import type {StorybookConfigVite} from '@storybook/builder-vite';
import type {StorybookConfig} from '@storybook/types';

const config: StorybookConfig & StorybookConfigVite = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: 'vitest.config.ts',
      },
    },
  },
  framework: {
    name: '@storybook/react-vite',
  },
};

export default config;

import type {StorybookConfigVite} from '@storybook/builder-vite';
import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig & StorybookConfigVite = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['storybook-addon-pseudo-states'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: 'vitest.config.ts',
      },
    },
  },
};

export default config;

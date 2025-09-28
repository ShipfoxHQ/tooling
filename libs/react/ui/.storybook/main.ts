import type {StorybookConfigVite} from '@storybook/builder-vite';
import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig & StorybookConfigVite = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: 'vitest.config.ts',
      },
    },
  },
  framework: '@storybook/react-vite',
};

export default config;

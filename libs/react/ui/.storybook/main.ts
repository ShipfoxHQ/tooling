import type {StorybookConfig} from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['storybook-addon-pseudo-states'],
  viteFinal: (config) => {
    // Ensure plugins array exists
    config.plugins = config.plugins || [];

    // Add React and Tailwind CSS plugins
    config.plugins.push(react(), tailwindcss());

    return config;
  },
};

export default config;

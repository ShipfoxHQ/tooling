import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['storybook-addon-pseudo-states', '@storybook/addon-vitest'],
  viteFinal: async (config) => {
    const [{default: react}, {default: tailwindcss}, {fileURLToPath}, {dirname, resolve}] =
      await Promise.all([
        import('@vitejs/plugin-react'),
        import('@tailwindcss/vite'),
        import('node:url'),
        import('node:path'),
      ]);

    config.plugins = config.plugins ?? [];
    config.plugins.push(react(), tailwindcss());

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

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

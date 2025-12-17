import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding'
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    const resolvedConfig = { ...config };
    resolvedConfig.resolve = resolvedConfig.resolve ?? {};
    resolvedConfig.resolve.alias = {
      ...(resolvedConfig.resolve.alias ?? {}),
      'next/image': resolve(__dirname, './next-image.ts')
    };
    return resolvedConfig;
  }
};
export default config;

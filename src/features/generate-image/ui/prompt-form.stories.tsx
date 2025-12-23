import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PromptForm } from './prompt-form';

const meta = {
  title: 'Features/GenerateImage/PromptForm',
  component: PromptForm,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof PromptForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prompt: 'Use the provided base image as a locked scene/background plate.',
    model: 'gemini-3-pro-image-preview',
    status: 'idle',
    isLoading: false,
    baseImageLabel: '베이스 이미지: 준비됨',
    referenceImageLabel: '참조 이미지: 2장',
    onPromptChange: () => {},
    onModelChange: () => {},
    onSubmit: () => {}
  }
};

export const Loading: Story = {
  args: {
    prompt: 'Use the provided base image as a locked scene/background plate.',
    model: 'gemini-3-pro-image-preview',
    status: 'loading',
    isLoading: true,
    baseImageLabel: '베이스 이미지: 준비됨',
    referenceImageLabel: '참조 이미지: 2장',
    onPromptChange: () => {},
    onModelChange: () => {},
    onSubmit: () => {}
  }
};

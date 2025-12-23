import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useStepStore } from '@/entities/step';
import { GenerateImagePage } from './generate-image-page';

const meta = {
  title: 'Pages/GenerateImage/GenerateImagePage',
  component: GenerateImagePage,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof GenerateImagePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      useStepStore.getState().reset();
      return <Story />;
    }
  ]
};

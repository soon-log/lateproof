import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { HelperText } from './helper-text';

const meta = {
  title: 'Features/UploadPhoto/HelperText',
  component: HelperText,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof HelperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMargin: Story = {
  args: {
    className: 'mt-8'
  }
};

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PhotoPreview } from './photo-preview';

const previewUrl =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="24">Preview</text></svg>'
  );

const meta = {
  title: 'Features/UploadPhoto/PhotoPreview',
  component: PhotoPreview,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onRemove: { action: 'remove' }
  }
} satisfies Meta<typeof PhotoPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    previewUrl,
    onRemove: () => {}
  }
};

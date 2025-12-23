import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ResultPreview } from './result-preview';

const ONE_BY_ONE_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

const meta = {
  title: 'Features/GenerateImage/ResultPreview',
  component: ResultPreview,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ResultPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    images: [],
    status: 'idle',
    onDownload: () => {},
    onDownloadAll: () => {}
  }
};

export const WithImages: Story = {
  args: {
    images: [
      { id: 'img-1', dataBase64: ONE_BY_ONE_PNG, mimeType: 'image/png' },
      { id: 'img-2', dataBase64: ONE_BY_ONE_PNG, mimeType: 'image/png' }
    ],
    status: 'success',
    onDownload: () => {},
    onDownloadAll: () => {}
  }
};

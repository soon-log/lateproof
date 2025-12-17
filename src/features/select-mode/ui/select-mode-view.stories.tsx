import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Mode } from '@/entities/step';
import { SelectModeView } from './select-mode-view';

const meta = {
  title: 'Features/SelectMode/SelectModeView',
  component: SelectModeView,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    setSelectedMode: { action: 'setSelectedMode' },
    selectedMode: {
      control: 'select',
      options: [null, Mode.PHOTO, Mode.MAP]
    }
  }
} satisfies Meta<typeof SelectModeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoneSelected: Story = {
  args: {
    selectedMode: null,
    setSelectedMode: () => {}
  }
};

export const PhotoSelected: Story = {
  args: {
    selectedMode: Mode.PHOTO,
    setSelectedMode: () => {}
  }
};

export const MapSelected: Story = {
  args: {
    selectedMode: Mode.MAP,
    setSelectedMode: () => {}
  }
};

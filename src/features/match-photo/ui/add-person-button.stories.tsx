import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AddPersonButton } from './add-person-button';

const meta = {
  title: 'Features/MatchPhoto/AddPersonButton',
  component: AddPersonButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onAdd: { action: 'add' }
  }
} satisfies Meta<typeof AddPersonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    canAdd: true,
    onAdd: () => {}
  }
};

export const Disabled: Story = {
  args: {
    canAdd: false,
    onAdd: () => {}
  }
};

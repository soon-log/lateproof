import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useStepStore } from '@/entities/step';
import { SelectModePage } from './select-mode-page';

const meta = {
  title: 'Pages/SelectMode/SelectModePage',
  component: SelectModePage,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SelectModePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    useStepStore.getState().reset();
    return <SelectModePage />;
  }
};

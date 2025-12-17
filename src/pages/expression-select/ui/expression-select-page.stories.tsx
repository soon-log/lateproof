import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { usePersonStore } from '@/entities/person';
import { useStepStore } from '@/entities/step';
import { ExpressionSelectPage } from './expression-select-page';

function setupStores() {
  usePersonStore.getState().reset();
  useStepStore.getState().reset();
}

const meta = {
  title: 'Pages/ExpressionSelect/ExpressionSelectPage',
  component: ExpressionSelectPage,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ExpressionSelectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      setupStores();
      return <Story />;
    }
  ]
};

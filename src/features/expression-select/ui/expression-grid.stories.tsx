import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ExpressionGrid } from './expression-grid';

const meta = {
  title: 'Features/ExpressionSelect/ExpressionGrid',
  component: ExpressionGrid,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    selectedExpression: null,
    onSelect: () => {},
    onReset: () => {},
    personIndex: 0
  }
} satisfies Meta<typeof ExpressionGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelectedExpression: Story = {
  args: {
    selectedExpression: '😄'
  }
};

export const AngrySelected: Story = {
  args: {
    selectedExpression: '😡',
    personIndex: 2
  }
};

export const LoveSelected: Story = {
  args: {
    selectedExpression: '🥰',
    personIndex: 4
  }
};

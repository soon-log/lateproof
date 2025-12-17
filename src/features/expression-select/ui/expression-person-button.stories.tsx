import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { ExpressionPersonButton } from './expression-person-button';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function createPerson(overrides: Partial<Person> = {}): Person {
  return {
    id: 'person-1',
    color: PersonColor.BLUE,
    facePhoto: null,
    facePhotoUrl: null,
    transform: {
      x: 0.2,
      y: 0.7,
      scale: 1,
      rotation: 0,
      imageScale: 1.5,
      imageOffsetX: 0,
      imageOffsetY: 0
    },
    expression: null,
    ...overrides
  };
}

const meta = {
  title: 'Features/ExpressionSelect/ExpressionPersonButton',
  component: ExpressionPersonButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    person: createPerson(),
    index: 0,
    isActive: false,
    onSelect: () => {}
  }
} satisfies Meta<typeof ExpressionPersonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    isActive: true
  }
};

export const WithPhoto: Story = {
  args: {
    person: createPerson({ facePhotoUrl: ONE_BY_ONE_PNG })
  }
};

export const WithPhotoActive: Story = {
  args: {
    person: createPerson({ facePhotoUrl: ONE_BY_ONE_PNG }),
    isActive: true
  }
};

export const WithExpression: Story = {
  args: {
    person: createPerson({
      facePhotoUrl: ONE_BY_ONE_PNG,
      expression: '😄'
    })
  }
};

export const WithExpressionActive: Story = {
  args: {
    person: createPerson({
      facePhotoUrl: ONE_BY_ONE_PNG,
      expression: '😡'
    }),
    isActive: true
  }
};

export const PurpleColor: Story = {
  args: {
    person: createPerson({
      color: PersonColor.PURPLE,
      facePhotoUrl: ONE_BY_ONE_PNG,
      expression: '🥰'
    }),
    index: 1,
    isActive: true
  }
};

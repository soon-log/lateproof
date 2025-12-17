import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { useStepStore } from '@/entities/step';
import { ExpressionSelectView } from './expression-select-view';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function createPerson(id: string, overrides: Partial<Person> = {}): Person {
  return {
    id,
    color: PersonColor.BLUE,
    facePhoto: new File(['x'], 'face.png', { type: 'image/png' }),
    facePhotoUrl: ONE_BY_ONE_PNG,
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

function setupDefaultStores() {
  usePersonStore.getState().reset();
  useStepStore.getState().reset();

  usePersonStore.setState({
    initialized: true,
    activePersonId: 'p1',
    persons: [
      createPerson('p1'),
      createPerson('p2', { color: PersonColor.PURPLE }),
      createPerson('p3', { color: PersonColor.RED })
    ]
  });
}

function setupWithExpressions() {
  usePersonStore.getState().reset();
  useStepStore.getState().reset();

  usePersonStore.setState({
    initialized: true,
    activePersonId: 'p1',
    persons: [
      createPerson('p1', { expression: '😄' }),
      createPerson('p2', { color: PersonColor.PURPLE, expression: '😡' }),
      createPerson('p3', { color: PersonColor.RED }),
      createPerson('p4', { color: PersonColor.YELLOW, expression: '🥰' }),
      createPerson('p5', { color: PersonColor.GREEN, expression: '😎' })
    ]
  });
}

const meta = {
  title: 'Features/ExpressionSelect/ExpressionSelectView',
  component: ExpressionSelectView,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ExpressionSelectView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => {
      setupDefaultStores();
      return <Story />;
    }
  ]
};

export const WithExpressions: Story = {
  decorators: [
    (Story) => {
      setupWithExpressions();
      return <Story />;
    }
  ]
};

export const SinglePerson: Story = {
  decorators: [
    (Story) => {
      usePersonStore.getState().reset();
      useStepStore.getState().reset();
      usePersonStore.setState({
        initialized: true,
        activePersonId: 'p1',
        persons: [createPerson('p1')]
      });
      return <Story />;
    }
  ]
};

export const FivePersons: Story = {
  decorators: [
    (Story) => {
      setupWithExpressions();
      return <Story />;
    }
  ]
};

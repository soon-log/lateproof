import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { usePersonStore } from '@/entities/person';
import { useStepStore } from '@/entities/step';
import { ExpressionSelectView } from './expression-select-view';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function setupStores() {
  usePersonStore.getState().reset();
  useStepStore.getState().reset();

  usePersonStore.setState({
    initialized: true,
    activePersonId: 'p1',
    persons: [
      {
        id: 'p1',
        color: 'BLUE',
        facePhoto: new File(['x'], 'face1.png', { type: 'image/png' }),
        facePhotoUrl: ONE_BY_ONE_PNG,
        transform: {
          x: 0.2,
          y: 0.7,
          scale: 1,
          rotation: 0,
          imageScale: 1.5,
          imageOffsetX: 0,
          imageOffsetY: 0
        }
      },
      {
        id: 'p2',
        color: 'PURPLE',
        facePhoto: new File(['x'], 'face2.png', { type: 'image/png' }),
        facePhotoUrl: ONE_BY_ONE_PNG,
        transform: {
          x: 0.6,
          y: 0.6,
          scale: 1,
          rotation: 0,
          imageScale: 1.5,
          imageOffsetX: 0,
          imageOffsetY: 0
        }
      }
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
      setupStores();
      return <Story />;
    }
  ]
};

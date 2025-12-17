import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo/model/store';
import { Step, useStepStore } from '@/entities/step';
import { MatchPhotoPage } from './match-photo-page';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function createPerson(id: string, color: PersonColor, overrides: Partial<Person> = {}): Person {
  const { expression, ...rest } = overrides;
  return {
    id,
    color,
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
    ...rest,
    expression: expression ?? null
  };
}

function setupStores() {
  usePhotoStore.getState().clear();
  usePersonStore.getState().reset();
  useStepStore.getState().reset();

  usePhotoStore.getState().setFile(new File(['x'], 'base.png', { type: 'image/png' }));

  usePersonStore.setState({
    initialized: true,
    activePersonId: 'p1',
    persons: [
      createPerson('p1', PersonColor.BLUE, {
        facePhoto: new File(['x'], 'face1.png', { type: 'image/png' }),
        facePhotoUrl: ONE_BY_ONE_PNG
      }),
      createPerson('p2', PersonColor.PURPLE, { facePhotoUrl: ONE_BY_ONE_PNG })
    ]
  });

  useStepStore.setState({
    currentStep: Step.MATCH,
    history: [
      {
        from: Step.UPLOAD,
        to: Step.MATCH,
        timestamp: new Date().toISOString(),
        reason: 'storybook'
      }
    ]
  });
}

const meta = {
  title: 'Pages/MatchPhoto/MatchPhotoPage',
  component: MatchPhotoPage,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof MatchPhotoPage>;

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

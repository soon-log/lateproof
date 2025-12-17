import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo/model/store';
import { Step, useStepStore } from '@/entities/step';
import { MatchPhotoView } from './match-photo-view';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function createPerson(id: string, color: PersonColor, overrides: Partial<Person> = {}): Person {
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
    ...overrides
  };
}

function setupStores(params: {
  hasBaseImage: boolean;
  persons: Person[];
  activePersonId: string | null;
}) {
  usePhotoStore.getState().clear();
  usePersonStore.getState().reset();
  useStepStore.getState().reset();

  if (params.hasBaseImage) {
    usePhotoStore.getState().setFile(new File(['x'], 'base.png', { type: 'image/png' }));
  }

  usePersonStore.setState({
    initialized: true,
    persons: params.persons,
    activePersonId: params.activePersonId
  });

  useStepStore.setState({
    currentStep: Step.MATCH
  });
}

const meta = {
  title: 'Features/MatchPhoto/MatchPhotoView',
  component: MatchPhotoView,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof MatchPhotoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoBaseImage: Story = {
  decorators: [
    (Story) => {
      setupStores({ hasBaseImage: false, persons: [], activePersonId: null });
      return <Story />;
    }
  ]
};

export const InProgress: Story = {
  decorators: [
    (Story) => {
      setupStores({
        hasBaseImage: true,
        persons: [
          createPerson('p1', PersonColor.BLUE),
          createPerson('p2', PersonColor.PURPLE, { facePhotoUrl: ONE_BY_ONE_PNG })
        ],
        activePersonId: 'p1'
      });
      return <Story />;
    }
  ]
};

export const ReadyToProceed: Story = {
  decorators: [
    (Story) => {
      setupStores({
        hasBaseImage: true,
        persons: [
          createPerson('p1', PersonColor.BLUE, {
            facePhoto: new File(['x'], 'face1.png', { type: 'image/png' }),
            facePhotoUrl: ONE_BY_ONE_PNG
          }),
          createPerson('p2', PersonColor.PURPLE, {
            facePhoto: new File(['x'], 'face2.png', { type: 'image/png' }),
            facePhotoUrl: ONE_BY_ONE_PNG
          })
        ],
        activePersonId: 'p1'
      });
      return <Story />;
    }
  ]
};

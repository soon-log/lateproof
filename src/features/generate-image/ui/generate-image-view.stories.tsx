import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo';
import type { useGenerateImage } from '../model/use-generate-image';
import { GenerateImageView } from './generate-image-view';

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

function setupStores() {
  usePersonStore.getState().reset();
  usePhotoStore.getState().clear();

  usePersonStore.setState({
    initialized: true,
    activePersonId: 'p1',
    persons: [createPerson('p1')]
  });

  usePhotoStore.setState({
    file: new File(['base'], 'base.png', { type: 'image/png' })
  });
}

function createController(overrides: Partial<ReturnType<typeof useGenerateImage>> = {}) {
  const controller: ReturnType<typeof useGenerateImage> = {
    status: 'idle',
    images: [],
    error: null,
    generate: async () => {},
    reset: () => {},
    ...overrides
  };

  return controller;
}

const meta = {
  title: 'Features/GenerateImage/GenerateImageView',
  component: GenerateImageView,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof GenerateImageView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    controller: createController()
  },
  decorators: [
    (Story) => {
      setupStores();
      return <Story />;
    }
  ]
};

export const WithResults: Story = {
  args: {
    controller: createController({
      status: 'success',
      images: [
        {
          id: 'img-1',
          dataBase64: ONE_BY_ONE_PNG.replace('data:image/png;base64,', ''),
          mimeType: 'image/png'
        }
      ]
    })
  },
  decorators: [
    (Story) => {
      setupStores();
      return <Story />;
    }
  ]
};

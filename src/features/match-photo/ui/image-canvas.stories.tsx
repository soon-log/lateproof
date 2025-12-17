import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { ImageCanvas } from './image-canvas';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function createPerson(
  id: string,
  color: PersonColor,
  x: number,
  y: number,
  overrides: Partial<Person> = {}
): Person {
  const { expression, ...rest } = overrides;
  return {
    id,
    color,
    facePhoto: null,
    facePhotoUrl: null,
    transform: { x, y, scale: 1, rotation: 0, imageScale: 1.5, imageOffsetX: 0, imageOffsetY: 0 },
    ...rest,
    expression: expression ?? null
  };
}

const meta = {
  title: 'Features/MatchPhoto/ImageCanvas',
  component: ImageCanvas,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ImageCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    baseImageUrl: ONE_BY_ONE_PNG,
    persons: [],
    activePersonId: null,
    onPositionChange: () => {},
    onScaleChange: () => {},
    onRotationChange: () => {},
    onImageOffsetChange: () => {},
    onImageScaleChange: () => {},
    onMarkerSelect: () => {}
  }
};

export const WithMarkers: Story = {
  args: {
    baseImageUrl: ONE_BY_ONE_PNG,
    persons: [
      createPerson('p1', PersonColor.BLUE, 0.25, 0.7),
      createPerson('p2', PersonColor.PURPLE, 0.6, 0.5, { facePhotoUrl: ONE_BY_ONE_PNG })
    ],
    activePersonId: 'p2',
    onPositionChange: () => {},
    onScaleChange: () => {},
    onRotationChange: () => {},
    onImageOffsetChange: () => {},
    onImageScaleChange: () => {},
    onMarkerSelect: () => {}
  }
};

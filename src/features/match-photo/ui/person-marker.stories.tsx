import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentProps } from 'react';
import { useRef } from 'react';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { PersonMarker } from './person-marker';

const ONE_BY_ONE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mP8/5+hHgAHggJ/Pm1H4QAAAABJRU5ErkJggg==';

function createPerson(overrides: Partial<Person> = {}): Person {
  const { expression, ...rest } = overrides;
  return {
    id: 'p1',
    color: PersonColor.BLUE,
    facePhoto: null,
    facePhotoUrl: null,
    transform: {
      x: 0.5,
      y: 0.5,
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

function Wrapper(props: Omit<ComponentProps<typeof PersonMarker>, 'containerRef'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-[360px] w-[480px] overflow-hidden rounded-2xl bg-neutral-100"
      style={{ aspectRatio: '4/3' }}
    >
      <PersonMarker {...props} containerRef={containerRef} />
    </div>
  );
}

const meta = {
  title: 'Features/MatchPhoto/PersonMarker',
  component: Wrapper,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'select' },
    onPositionChange: { action: 'position-change' },
    onScaleChange: { action: 'scale-change' },
    onRotationChange: { action: 'rotation-change' },
    onImageOffsetChange: { action: 'image-offset-change' },
    onImageScaleChange: { action: 'image-scale-change' }
  }
} satisfies Meta<typeof Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    person: createPerson(),
    isActive: false,
    onPositionChange: () => {},
    onScaleChange: () => {},
    onRotationChange: () => {},
    onImageOffsetChange: () => {},
    onImageScaleChange: () => {},
    onSelect: () => {}
  }
};

export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true
  }
};

export const ActiveWithPhoto: Story = {
  args: {
    ...Default.args,
    isActive: true,
    person: createPerson({ facePhotoUrl: ONE_BY_ONE_PNG })
  }
};

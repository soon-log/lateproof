import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { PersonButton } from './person-button';

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

const meta = {
  title: 'Features/MatchPhoto/PersonButton',
  component: PersonButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onSelect: { action: 'select' },
    onDelete: { action: 'delete' },
    onUploadClick: { action: 'upload-click' }
  }
} satisfies Meta<typeof PersonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    person: createPerson(),
    isActive: false,
    canDelete: false,
    onSelect: () => {},
    onDelete: () => {},
    onUploadClick: () => {}
  }
};

export const Active: Story = {
  args: {
    ...Default.args,
    isActive: true
  }
};

export const WithPhoto: Story = {
  args: {
    ...Default.args,
    person: createPerson({ facePhotoUrl: ONE_BY_ONE_PNG })
  }
};

export const Deletable: Story = {
  args: {
    ...Default.args,
    canDelete: true
  }
};

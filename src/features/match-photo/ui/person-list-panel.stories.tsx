import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { Person } from '@/entities/person';
import { PersonColor } from '@/entities/person';
import { PersonListPanel } from './person-list-panel';

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

const meta = {
  title: 'Features/MatchPhoto/PersonListPanel',
  component: PersonListPanel,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onSelectPerson: { action: 'select-person' },
    onAddPerson: { action: 'add-person' },
    onRemovePerson: { action: 'remove-person' },
    onUploadPhoto: { action: 'upload-photo' },
    onReset: { action: 'reset' }
  }
} satisfies Meta<typeof PersonListPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    persons: [
      createPerson('p1', PersonColor.BLUE),
      createPerson('p2', PersonColor.PURPLE, { facePhotoUrl: ONE_BY_ONE_PNG })
    ],
    activePersonId: 'p1',
    canAddPerson: true,
    canRemovePerson: true,
    onSelectPerson: () => {},
    onAddPerson: () => {},
    onRemovePerson: () => {},
    onUploadPhoto: () => {},
    onReset: () => {}
  }
};

export const CannotRemove: Story = {
  args: {
    ...Default.args,
    persons: [createPerson('p1', PersonColor.BLUE)],
    canRemovePerson: false
  }
};

export const MaxPersons: Story = {
  args: {
    ...Default.args,
    persons: [
      createPerson('p1', PersonColor.BLUE),
      createPerson('p2', PersonColor.PURPLE),
      createPerson('p3', PersonColor.RED),
      createPerson('p4', PersonColor.YELLOW),
      createPerson('p5', PersonColor.GREEN)
    ],
    canAddPerson: false
  }
};

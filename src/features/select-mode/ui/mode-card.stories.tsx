/**
 * ModeCard — Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Camera, MapPin } from 'lucide-react';
import { ModeCard } from './mode-card';

const meta = {
  title: 'Features/SelectMode/ModeCard',
  component: ModeCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' }
  }
} satisfies Meta<typeof ModeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PhotoMode: Story = {
  args: {
    icon: Camera,
    title: '사진으로 만들기',
    description: '내가 찍은 사진에 자연스럽게 인물을 추가해요',
    badge: (
      <span className="rounded-full bg-brand-500 px-3 py-1 font-semibold text-white text-xs">
        추천
      </span>
    ),
    isSelected: false,
    onClick: () => {}
  }
};

export const PhotoModeSelected: Story = {
  args: {
    icon: Camera,
    title: '사진으로 만들기',
    description: '내가 찍은 사진에 자연스럽게 인물을 추가해요',
    badge: (
      <span className="rounded-full bg-brand-500 px-3 py-1 font-semibold text-white text-xs">
        추천
      </span>
    ),
    isSelected: true,
    onClick: () => {}
  }
};

export const MapMode: Story = {
  args: {
    icon: MapPin,
    title: '장소로 만들기',
    description: '원하는 장소를 선택하면 그 분위기로 만들어요',
    isSelected: false,
    onClick: () => {}
  }
};

export const MapModeSelected: Story = {
  args: {
    icon: MapPin,
    title: '장소로 만들기',
    description: '원하는 장소를 선택하면 그 분위기로 만들어요',
    isSelected: true,
    onClick: () => {}
  }
};

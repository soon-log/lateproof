/**
 * NextStepButton — Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NextStepButton } from './next-step-button';

const meta = {
  title: 'Shared/NextStepButton',
  component: NextStepButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부'
    },
    isLoading: {
      control: 'boolean',
      description: '로딩 상태 여부'
    },
    loadingText: {
      control: 'text',
      description: '로딩 중 표시할 텍스트'
    },
    children: {
      control: 'text',
      description: '버튼 텍스트'
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '버튼 스타일 변형'
    }
  }
} satisfies Meta<typeof NextStepButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 "다음으로" 버튼
 */
export const Default: Story = {
  args: {}
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    disabled: true
  }
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    isLoading: true
  }
};

/**
 * 커스텀 로딩 텍스트
 */
export const CustomLoadingText: Story = {
  args: {
    isLoading: true,
    loadingText: '올리는 중...'
  }
};

/**
 * 커스텀 버튼 텍스트
 */
export const CustomText: Story = {
  args: {
    children: '확인하기'
  }
};

/**
 * Secondary 스타일
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary'
  }
};

/**
 * Outline 스타일
 */
export const Outline: Story = {
  args: {
    variant: 'outline'
  }
};

/**
 * 커스텀 클래스 적용
 */
export const CustomClassName: Story = {
  args: {
    className: 'bg-gradient-to-r from-brand-500 to-accent-500'
  }
};

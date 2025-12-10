import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg']
    },
    disabled: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variant
export const Default: Story = {
  args: {
    children: '만들기'
  }
};

// Destructive variant
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '삭제하기'
  }
};

// Outline variant
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '자세히 보기'
  }
};

// Secondary variant
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '다음으로'
  }
};

// Ghost variant
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '건너뛰기'
  }
};

// Link variant
export const Link: Story = {
  args: {
    variant: 'link',
    children: '더 알아보기'
  }
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: '작은 버튼'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: '큰 버튼'
  }
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: '아주 큰 버튼'
  }
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: '비활성화',
    disabled: true
  }
};

// With icon
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="graphics-symbol"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        다음으로
      </>
    )
  }
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="default">만들기</Button>
        <Button variant="destructive">삭제하기</Button>
        <Button variant="outline">자세히 보기</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">다음으로</Button>
        <Button variant="ghost">건너뛰기</Button>
        <Button variant="link">더 알아보기</Button>
      </div>
    </div>
  )
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">작게</Button>
      <Button size="default">보통</Button>
      <Button size="lg">크게</Button>
      <Button size="xl">아주 크게</Button>
    </div>
  )
};

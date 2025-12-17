import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Step, useStepStore } from '@/entities/step';
import { StepHeader } from './step-header';

const meta = {
  title: 'Widgets/StepHeader/StepHeader',
  component: StepHeader,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof StepHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoBack: Story = {
  args: {
    title: '어떤 방식으로 만들까요?',
    description: '사진을 올리거나, 장소를 선택해주세요'
  },
  render: (args) => {
    useStepStore.getState().reset();
    return <StepHeader {...args} />;
  }
};

export const CanGoBack: Story = {
  args: {
    title: '사진을 선택해주세요',
    description: '배경이 잘 나온 사진을 선택하면 더 자연스러운 결과를 얻을 수 있어요'
  },
  render: (args) => {
    useStepStore.getState().reset();
    useStepStore.setState({
      currentStep: Step.UPLOAD,
      history: [
        {
          from: Step.SELECT_MODE,
          to: Step.UPLOAD,
          timestamp: new Date().toISOString(),
          reason: 'storybook'
        }
      ]
    });

    return <StepHeader {...args} />;
  }
};

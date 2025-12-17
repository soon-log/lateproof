import { ExpressionSelectView } from '@/features/expression-select';
import { StepHeader } from '@/widgets/step-header';

export function ExpressionSelectPage() {
  return (
    <div className="w-full">
      <StepHeader title="표정을 선택해주세요" description="각 인물에 적용할 표정을 선택하세요" />
      <ExpressionSelectView />
    </div>
  );
}

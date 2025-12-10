import type { Step } from './step';

export const Mode = {
  PHOTO: 'PHOTO',
  MAP: 'MAP'
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];

export interface StepTransitionContext {
  from: Step; // 이전 Step
  to: Step; // 다음 Step
  timestamp: string; // 전환 시각 (ISO 8601)
  reason?: string; // 전환 사유 (선택)
}

export interface StepState {
  currentStep: Step; // 현재 Step
  mode: Mode | null; // 선택된 모드
  history: StepTransitionContext[];
}

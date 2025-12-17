/**
 * Step — LateProof 워크플로우 단계 정의
 *
 * @description
 * SELECT_MODE → UPLOAD → MATCH → EXPRESSION → PAYMENT → GENERATE → RESULT 순서로 진행
 * Transition Table에 정의된 규칙에 따라서만 Step 전환 가능
 */

export const Step = {
  SELECT_MODE: 'SELECT_MODE',
  UPLOAD: 'UPLOAD',
  MATCH: 'MATCH',
  EXPRESSION: 'EXPRESSION',
  PAYMENT: 'PAYMENT',
  GENERATE: 'GENERATE',
  RESULT: 'RESULT'
} as const;

export type Step = (typeof Step)[keyof typeof Step];

export interface StepMeta {
  step: Step;
  label: string;
  progress: number; // Step 진행률 (0~100)
  canGoBack: boolean; // 이전 Step으로 돌아갈 수 있는지 여부
}

export const STEP_META: Record<Step, StepMeta> = {
  [Step.SELECT_MODE]: {
    step: Step.SELECT_MODE,
    label: '모드 선택',
    progress: 0,
    canGoBack: false
  },
  [Step.UPLOAD]: {
    step: Step.UPLOAD,
    label: '사진 올리기',
    progress: 20,
    canGoBack: true
  },
  [Step.MATCH]: {
    step: Step.MATCH,
    label: '얼굴 매칭',
    progress: 35,
    canGoBack: true
  },
  [Step.EXPRESSION]: {
    step: Step.EXPRESSION,
    label: '표정 선택',
    progress: 50,
    canGoBack: true
  },
  [Step.PAYMENT]: {
    step: Step.PAYMENT,
    label: '결제',
    progress: 60,
    canGoBack: true
  },
  [Step.GENERATE]: {
    step: Step.GENERATE,
    label: '생성 중',
    progress: 80,
    canGoBack: false
  },
  [Step.RESULT]: {
    step: Step.RESULT,
    label: '완료',
    progress: 100,
    canGoBack: false
  }
};

export const STEP_ORDER: Step[] = [
  Step.SELECT_MODE,
  Step.UPLOAD,
  Step.MATCH,
  Step.EXPRESSION,
  Step.PAYMENT,
  Step.GENERATE,
  Step.RESULT
];

import { Step } from './step';

/**
 * Step 전환 규칙
 *
 * @example
 * TRANSITION_TABLE[Step.SELECT_MODE] = [Step.UPLOAD]
 * → SELECT_MODE에서 UPLOAD로만 전환 가능
 */
export const TRANSITION_TABLE: Record<Step, Step[]> = {
  [Step.SELECT_MODE]: [Step.UPLOAD],

  [Step.UPLOAD]: [
    Step.SELECT_MODE, // 뒤로 가기
    Step.MATCH // 다음
  ],

  [Step.MATCH]: [
    Step.UPLOAD, // 뒤로 가기
    Step.EXPRESSION // 다음: 표정 선택
  ],

  [Step.EXPRESSION]: [
    Step.MATCH, // 뒤로 가기
    Step.PAYMENT // 다음: 결제
  ],

  [Step.PAYMENT]: [
    Step.EXPRESSION, // 뒤로 가기
    Step.GENERATE // 결제 성공 후 생성
  ],

  [Step.GENERATE]: [
    Step.RESULT // 생성 완료 후 결과
  ],

  [Step.RESULT]: [
    Step.SELECT_MODE // 처음부터 다시 시작
  ]
};

/**
 * Step 전환 가능 여부 확인
 *
 * @param from - 현재 Step
 * @param to - 이동하려는 Step
 * @returns 전환 가능 여부
 *
 * @example
 * canTransition(Step.SELECT_MODE, Step.UPLOAD) // true
 * canTransition(Step.SELECT_MODE, Step.PAYMENT) // false
 */
export function canTransition(from: Step, to: Step): boolean {
  const allowedSteps = TRANSITION_TABLE[from];
  return allowedSteps.includes(to);
}

/**
 * 다음 Step 목록 조회
 *
 * @param currentStep - 현재 Step
 * @returns 전환 가능한 Step 목록
 *
 * @example
 * getNextSteps(Step.UPLOAD) // [Step.SELECT_MODE, Step.MATCH]
 */
export function getNextSteps(currentStep: Step): Step[] {
  return TRANSITION_TABLE[currentStep] || [];
}

/**
 * Step 전환 오류 타입
 */
export class TransitionError extends Error {
  constructor(from: Step, to: Step) {
    super(`Invalid transition: ${from} → ${to}`);
    this.name = 'TransitionError';
  }
}

/**
 * 안전한 Step 전환 (검증 포함)
 *
 * @param from - 현재 Step
 * @param to - 이동하려는 Step
 * @throws {TransitionError} 전환 불가능한 경우
 *
 * @example
 * validateTransition(Step.SELECT_MODE, Step.UPLOAD) // OK
 * validateTransition(Step.SELECT_MODE, Step.PAYMENT) // throws TransitionError
 */
export function validateTransition(from: Step, to: Step): void {
  if (!canTransition(from, to)) {
    throw new TransitionError(from, to);
  }
}

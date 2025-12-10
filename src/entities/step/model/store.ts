/**
 * Step FSM Store — Zustand 기반 상태 관리
 *
 * @description
 * LateProof 워크플로우의 Step 전환을 관리하는 FSM Store
 * - Transition Table 기반 전환 검증
 * - 전환 히스토리 기록
 * - 모드 선택 상태 관리
 */

import type {} from '@redux-devtools/extension';
import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Step, Step as StepEnum } from './step';
import { canTransition } from './transition';
import type { Mode, StepState, StepTransitionContext } from './types';

interface StepStore extends StepState {
  setMode: (mode: Mode) => void;
  nextStep: (to: Step, reason?: string) => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState: StepState = {
  currentStep: StepEnum.SELECT_MODE,
  mode: null,
  history: []
};

// =============================================================================
// Helper Types
// =============================================================================

type SetStepStore = Parameters<StateCreator<StepStore>>[0];
type GetStepStore = Parameters<StateCreator<StepStore>>[1];

// =============================================================================
// Action Creators (Helper Functions)
// =============================================================================

const createSetMode = (set: SetStepStore) => (mode: Mode) => {
  set({ mode });
};

const createNextStep = (set: SetStepStore, get: GetStepStore) => (to: Step, reason?: string) => {
  const { currentStep, history } = get();

  if (!canTransition(currentStep, to)) {
    console.error(`Invalid transition: ${currentStep} → ${to}`);
    throw new Error(`Cannot transition from ${currentStep} to ${to}`);
  }

  const transitionContext: StepTransitionContext = {
    from: currentStep,
    to,
    timestamp: new Date().toISOString(),
    reason
  };

  set({
    currentStep: to,
    history: [...history, transitionContext]
  });
};

const createPrevStep = (set: SetStepStore, get: GetStepStore) => () => {
  const { history } = get();

  if (history.length === 0) {
    console.warn('No history to go back');
    return;
  }

  const newHistory = history.slice(0, -1);
  const previousStep =
    newHistory.length > 0 ? newHistory?.[newHistory.length - 1]?.to : StepEnum.SELECT_MODE;

  set({
    currentStep: previousStep,
    history: newHistory
  });
};

const createReset = (set: SetStepStore) => () => {
  set(initialState);
};

// =============================================================================
// Store Definition
// =============================================================================

export const useStepStore = create<StepStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setMode: createSetMode(set),
      nextStep: createNextStep(set, get),
      prevStep: createPrevStep(set, get),
      reset: createReset(set)
    }),
    {
      name: 'step-store'
    }
  )
);

// =============================================================================
// Selectors (Performance Optimization)
// =============================================================================

export const selectCurrentStep = (state: StepStore) => state.currentStep;
export const selectMode = (state: StepStore) => state.mode;
export const selectHistory = (state: StepStore) => state.history;
export const selectCanGoBack = (state: StepStore) => state.history.length > 0;

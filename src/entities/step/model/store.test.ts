/**
 * Step Store Unit Test
 *
 * @description
 * Zustand FSM Store의 핵심 로직 테스트
 * - Step 전환 검증
 * - 히스토리 관리
 * - 모드 선택
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Mode, Step } from '@/entities/step';
import {
  selectCanGoBack,
  selectCurrentStep,
  selectHistory,
  selectMode,
  useStepStore
} from './store';

describe('useStepStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 store 초기화
    act(() => {
      useStepStore.getState().reset();
    });
  });

  describe('초기 상태', () => {
    it('SELECT_MODE로 시작해야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      expect(result.current.currentStep).toBe(Step.SELECT_MODE);
      expect(result.current.mode).toBeNull();
      expect(result.current.history).toEqual([]);
    });
  });

  describe('setMode', () => {
    it('모드를 PHOTO로 설정할 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.setMode(Mode.PHOTO);
      });

      expect(result.current.mode).toBe(Mode.PHOTO);
    });

    it('모드를 MAP으로 설정할 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.setMode(Mode.MAP);
      });

      expect(result.current.mode).toBe(Mode.MAP);
    });
  });

  describe('nextStep', () => {
    it('SELECT_MODE에서 UPLOAD로 전환할 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD);
      });

      expect(result.current.currentStep).toBe(Step.UPLOAD);
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0]).toMatchObject({
        from: Step.SELECT_MODE,
        to: Step.UPLOAD
      });
    });

    it('허용되지 않은 전환은 에러를 던져야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      expect(() => {
        act(() => {
          result.current.nextStep(Step.PAYMENT); // SELECT_MODE → PAYMENT는 불가능
        });
      }).toThrow();
    });

    it('전환 이유를 기록할 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD, '사용자가 이미지 선택 완료');
      });

      expect(result.current.history?.[0]?.reason).toBe('사용자가 이미지 선택 완료');
    });

    it('여러 Step을 순차적으로 전환할 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD);
      });

      act(() => {
        result.current.nextStep(Step.MATCH);
      });

      act(() => {
        result.current.nextStep(Step.EXPRESSION);
      });

      act(() => {
        result.current.nextStep(Step.PAYMENT);
      });

      expect(result.current.currentStep).toBe(Step.PAYMENT);
      expect(result.current.history).toHaveLength(4);
    });
  });

  describe('prevStep', () => {
    it('이전 Step으로 돌아갈 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD);
      });

      act(() => {
        result.current.nextStep(Step.MATCH);
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(Step.UPLOAD);
      expect(result.current.history).toHaveLength(1);
    });

    it('히스토리가 없으면 SELECT_MODE로 돌아가야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD);
      });

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(Step.SELECT_MODE);
      expect(result.current.history).toHaveLength(0);
    });

    it('히스토리가 비어있을 때 prevStep 호출 시 경고만 출력해야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      // 초기 상태에서 prevStep 호출
      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(Step.SELECT_MODE);
      expect(result.current.history).toHaveLength(0);
    });
  });

  describe('reset', () => {
    it('Store를 초기 상태로 리셋할 수 있어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.setMode(Mode.PHOTO);
        result.current.nextStep(Step.UPLOAD);
        result.current.nextStep(Step.MATCH);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentStep).toBe(Step.SELECT_MODE);
      expect(result.current.mode).toBeNull();
      expect(result.current.history).toEqual([]);
    });
  });

  describe('히스토리 관리', () => {
    it('모든 전환이 히스토리에 기록되어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD);
        result.current.nextStep(Step.MATCH);
        result.current.nextStep(Step.EXPRESSION);
        result.current.nextStep(Step.PAYMENT);
      });

      expect(result.current.history).toHaveLength(4);
      expect(result.current.history?.[0]?.from).toBe(Step.SELECT_MODE);
      expect(result.current.history?.[0]?.to).toBe(Step.UPLOAD);
      expect(result.current.history?.[1]?.from).toBe(Step.UPLOAD);
      expect(result.current.history?.[1]?.to).toBe(Step.MATCH);
      expect(result.current.history?.[2]?.from).toBe(Step.MATCH);
      expect(result.current.history?.[2]?.to).toBe(Step.EXPRESSION);
      expect(result.current.history?.[3]?.from).toBe(Step.EXPRESSION);
      expect(result.current.history?.[3]?.to).toBe(Step.PAYMENT);
    });

    it('각 전환에 타임스탬프가 기록되어야 한다', () => {
      const { result } = renderHook(() => useStepStore());

      act(() => {
        result.current.nextStep(Step.UPLOAD);
      });

      expect(result.current.history?.[0]?.timestamp).toBeDefined();
      expect(new Date(result.current.history?.[0]?.timestamp ?? '').getTime()).not.toBeNaN();
    });
  });

  describe('Selectors', () => {
    it('selectCurrentStep이 올바르게 동작해야 한다', () => {
      const { result } = renderHook(() => useStepStore(selectCurrentStep));

      expect(result.current).toBe(Step.SELECT_MODE);

      act(() => {
        useStepStore.getState().nextStep(Step.UPLOAD);
      });

      const { result: updatedResult } = renderHook(() => useStepStore(selectCurrentStep));
      expect(updatedResult.current).toBe(Step.UPLOAD);
    });

    it('selectMode가 올바르게 동작해야 한다', () => {
      const { result } = renderHook(() => useStepStore(selectMode));

      expect(result.current).toBeNull();

      act(() => {
        useStepStore.getState().setMode(Mode.PHOTO);
      });

      const { result: updatedResult } = renderHook(() => useStepStore(selectMode));
      expect(updatedResult.current).toBe(Mode.PHOTO);
    });

    it('selectHistory가 올바르게 동작해야 한다', () => {
      const { result } = renderHook(() => useStepStore(selectHistory));

      expect(result.current).toEqual([]);

      act(() => {
        useStepStore.getState().nextStep(Step.UPLOAD);
      });

      const { result: updatedResult } = renderHook(() => useStepStore(selectHistory));
      expect(updatedResult.current).toHaveLength(1);
    });

    it('selectCanGoBack이 올바르게 동작해야 한다', () => {
      const { result: initialResult } = renderHook(() => useStepStore(selectCanGoBack));

      // 초기 상태: 히스토리 없음
      expect(initialResult.current).toBe(false);

      act(() => {
        useStepStore.getState().nextStep(Step.UPLOAD);
      });

      const { result: updatedResult } = renderHook(() => useStepStore(selectCanGoBack));
      // 전환 후: 히스토리 있음
      expect(updatedResult.current).toBe(true);
    });
  });
});

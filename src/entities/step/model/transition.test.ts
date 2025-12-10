/**
 * Transition Logic Unit Test
 *
 * @description
 * FSM Transition Table 및 전환 로직 테스트
 * - TRANSITION_TABLE 검증
 * - canTransition 함수
 * - getNextSteps 함수
 * - validateTransition 함수
 * - TransitionError 클래스
 */

import { describe, expect, it } from 'vitest';
import { Step } from './step';
import {
  canTransition,
  getNextSteps,
  TRANSITION_TABLE,
  TransitionError,
  validateTransition
} from './transition';

describe('TRANSITION_TABLE', () => {
  it('모든 Step에 대한 전환 규칙이 정의되어 있어야 한다', () => {
    const allSteps = Object.values(Step);

    for (const step of allSteps) {
      expect(TRANSITION_TABLE[step]).toBeDefined();
      expect(Array.isArray(TRANSITION_TABLE[step])).toBe(true);
    }
  });

  it('SELECT_MODE은 UPLOAD로만 전환 가능해야 한다', () => {
    expect(TRANSITION_TABLE[Step.SELECT_MODE]).toEqual([Step.UPLOAD]);
  });

  it('UPLOAD는 SELECT_MODE과 MATCH로 전환 가능해야 한다', () => {
    expect(TRANSITION_TABLE[Step.UPLOAD]).toEqual([Step.SELECT_MODE, Step.MATCH]);
  });

  it('MATCH는 UPLOAD와 PAYMENT로 전환 가능해야 한다', () => {
    expect(TRANSITION_TABLE[Step.MATCH]).toEqual([Step.UPLOAD, Step.PAYMENT]);
  });

  it('PAYMENT는 MATCH와 GENERATE로 전환 가능해야 한다', () => {
    expect(TRANSITION_TABLE[Step.PAYMENT]).toEqual([Step.MATCH, Step.GENERATE]);
  });

  it('GENERATE는 RESULT로만 전환 가능해야 한다', () => {
    expect(TRANSITION_TABLE[Step.GENERATE]).toEqual([Step.RESULT]);
  });

  it('RESULT는 SELECT_MODE로만 전환 가능해야 한다', () => {
    expect(TRANSITION_TABLE[Step.RESULT]).toEqual([Step.SELECT_MODE]);
  });
});

describe('canTransition', () => {
  describe('유효한 전환', () => {
    it('SELECT_MODE → UPLOAD 전환이 가능해야 한다', () => {
      expect(canTransition(Step.SELECT_MODE, Step.UPLOAD)).toBe(true);
    });

    it('UPLOAD → MATCH 전환이 가능해야 한다', () => {
      expect(canTransition(Step.UPLOAD, Step.MATCH)).toBe(true);
    });

    it('UPLOAD → SELECT_MODE 전환이 가능해야 한다 (뒤로가기)', () => {
      expect(canTransition(Step.UPLOAD, Step.SELECT_MODE)).toBe(true);
    });

    it('MATCH → PAYMENT 전환이 가능해야 한다', () => {
      expect(canTransition(Step.MATCH, Step.PAYMENT)).toBe(true);
    });

    it('PAYMENT → GENERATE 전환이 가능해야 한다', () => {
      expect(canTransition(Step.PAYMENT, Step.GENERATE)).toBe(true);
    });

    it('GENERATE → RESULT 전환이 가능해야 한다', () => {
      expect(canTransition(Step.GENERATE, Step.RESULT)).toBe(true);
    });

    it('RESULT → SELECT_MODE 전환이 가능해야 한다', () => {
      expect(canTransition(Step.RESULT, Step.SELECT_MODE)).toBe(true);
    });
  });

  describe('유효하지 않은 전환', () => {
    it('SELECT_MODE → MATCH 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.SELECT_MODE, Step.MATCH)).toBe(false);
    });

    it('SELECT_MODE → PAYMENT 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.SELECT_MODE, Step.PAYMENT)).toBe(false);
    });

    it('SELECT_MODE → GENERATE 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.SELECT_MODE, Step.GENERATE)).toBe(false);
    });

    it('SELECT_MODE → RESULT 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.SELECT_MODE, Step.RESULT)).toBe(false);
    });

    it('UPLOAD → PAYMENT 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.UPLOAD, Step.PAYMENT)).toBe(false);
    });

    it('MATCH → GENERATE 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.MATCH, Step.GENERATE)).toBe(false);
    });

    it('PAYMENT → RESULT 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.PAYMENT, Step.RESULT)).toBe(false);
    });

    it('GENERATE → SELECT_MODE 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.GENERATE, Step.SELECT_MODE)).toBe(false);
    });

    it('RESULT → UPLOAD 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.RESULT, Step.UPLOAD)).toBe(false);
    });
  });

  describe('같은 Step으로의 전환', () => {
    it('SELECT_MODE → SELECT_MODE 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.SELECT_MODE, Step.SELECT_MODE)).toBe(false);
    });

    it('UPLOAD → UPLOAD 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.UPLOAD, Step.UPLOAD)).toBe(false);
    });

    it('MATCH → MATCH 전환이 불가능해야 한다', () => {
      expect(canTransition(Step.MATCH, Step.MATCH)).toBe(false);
    });
  });
});

describe('getNextSteps', () => {
  it('SELECT_MODE의 다음 Step 목록을 반환해야 한다', () => {
    const nextSteps = getNextSteps(Step.SELECT_MODE);
    expect(nextSteps).toEqual([Step.UPLOAD]);
    expect(nextSteps).toHaveLength(1);
  });

  it('UPLOAD의 다음 Step 목록을 반환해야 한다', () => {
    const nextSteps = getNextSteps(Step.UPLOAD);
    expect(nextSteps).toEqual([Step.SELECT_MODE, Step.MATCH]);
    expect(nextSteps).toHaveLength(2);
  });

  it('MATCH의 다음 Step 목록을 반환해야 한다', () => {
    const nextSteps = getNextSteps(Step.MATCH);
    expect(nextSteps).toEqual([Step.UPLOAD, Step.PAYMENT]);
    expect(nextSteps).toHaveLength(2);
  });

  it('PAYMENT의 다음 Step 목록을 반환해야 한다', () => {
    const nextSteps = getNextSteps(Step.PAYMENT);
    expect(nextSteps).toEqual([Step.MATCH, Step.GENERATE]);
    expect(nextSteps).toHaveLength(2);
  });

  it('GENERATE의 다음 Step 목록을 반환해야 한다', () => {
    const nextSteps = getNextSteps(Step.GENERATE);
    expect(nextSteps).toEqual([Step.RESULT]);
    expect(nextSteps).toHaveLength(1);
  });

  it('RESULT의 다음 Step 목록을 반환해야 한다', () => {
    const nextSteps = getNextSteps(Step.RESULT);
    expect(nextSteps).toEqual([Step.SELECT_MODE]);
    expect(nextSteps).toHaveLength(1);
  });
});

describe('TransitionError', () => {
  it('올바른 에러 메시지를 생성해야 한다', () => {
    const error = new TransitionError(Step.SELECT_MODE, Step.PAYMENT);

    expect(error.message).toBe('Invalid transition: SELECT_MODE → PAYMENT');
    expect(error.name).toBe('TransitionError');
  });

  it('Error 클래스를 상속받아야 한다', () => {
    const error = new TransitionError(Step.UPLOAD, Step.GENERATE);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TransitionError);
  });

  it('다양한 Step 조합에 대한 에러 메시지를 생성해야 한다', () => {
    const error1 = new TransitionError(Step.MATCH, Step.RESULT);
    const error2 = new TransitionError(Step.GENERATE, Step.PAYMENT);

    expect(error1.message).toBe('Invalid transition: MATCH → RESULT');
    expect(error2.message).toBe('Invalid transition: GENERATE → PAYMENT');
  });
});

describe('validateTransition', () => {
  describe('유효한 전환', () => {
    it('SELECT_MODE → UPLOAD 전환을 허용해야 한다', () => {
      expect(() => {
        validateTransition(Step.SELECT_MODE, Step.UPLOAD);
      }).not.toThrow();
    });

    it('UPLOAD → MATCH 전환을 허용해야 한다', () => {
      expect(() => {
        validateTransition(Step.UPLOAD, Step.MATCH);
      }).not.toThrow();
    });

    it('MATCH → PAYMENT 전환을 허용해야 한다', () => {
      expect(() => {
        validateTransition(Step.MATCH, Step.PAYMENT);
      }).not.toThrow();
    });

    it('PAYMENT → GENERATE 전환을 허용해야 한다', () => {
      expect(() => {
        validateTransition(Step.PAYMENT, Step.GENERATE);
      }).not.toThrow();
    });

    it('GENERATE → RESULT 전환을 허용해야 한다', () => {
      expect(() => {
        validateTransition(Step.GENERATE, Step.RESULT);
      }).not.toThrow();
    });

    it('RESULT → SELECT_MODE 전환을 허용해야 한다', () => {
      expect(() => {
        validateTransition(Step.RESULT, Step.SELECT_MODE);
      }).not.toThrow();
    });
  });

  describe('유효하지 않은 전환', () => {
    it('SELECT_MODE → PAYMENT 전환 시 TransitionError를 던져야 한다', () => {
      expect(() => {
        validateTransition(Step.SELECT_MODE, Step.PAYMENT);
      }).toThrow(TransitionError);
    });

    it('UPLOAD → GENERATE 전환 시 TransitionError를 던져야 한다', () => {
      expect(() => {
        validateTransition(Step.UPLOAD, Step.GENERATE);
      }).toThrow(TransitionError);
    });

    it('MATCH → RESULT 전환 시 TransitionError를 던져야 한다', () => {
      expect(() => {
        validateTransition(Step.MATCH, Step.RESULT);
      }).toThrow(TransitionError);
    });

    it('에러 메시지가 올바른 형식이어야 한다', () => {
      expect(() => {
        validateTransition(Step.SELECT_MODE, Step.PAYMENT);
      }).toThrow('Invalid transition: SELECT_MODE → PAYMENT');
    });

    it('에러 타입이 TransitionError여야 한다', () => {
      try {
        validateTransition(Step.UPLOAD, Step.RESULT);
      } catch (error) {
        expect(error).toBeInstanceOf(TransitionError);
        expect((error as TransitionError).name).toBe('TransitionError');
      }
    });
  });

  describe('Edge Cases', () => {
    it('같은 Step으로의 전환 시 TransitionError를 던져야 한다', () => {
      expect(() => {
        validateTransition(Step.SELECT_MODE, Step.SELECT_MODE);
      }).toThrow(TransitionError);
    });

    it('순환 전환이 불가능해야 한다', () => {
      // GENERATE → SELECT_MODE (직접)는 불가능
      expect(() => {
        validateTransition(Step.GENERATE, Step.SELECT_MODE);
      }).toThrow(TransitionError);

      // RESULT → UPLOAD (건너뛰기)는 불가능
      expect(() => {
        validateTransition(Step.RESULT, Step.UPLOAD);
      }).toThrow(TransitionError);
    });
  });
});

describe('전체 워크플로우 시나리오', () => {
  it('Happy Path: 처음부터 끝까지 전환이 가능해야 한다', () => {
    const happyPath = [
      { from: Step.SELECT_MODE, to: Step.UPLOAD },
      { from: Step.UPLOAD, to: Step.MATCH },
      { from: Step.MATCH, to: Step.PAYMENT },
      { from: Step.PAYMENT, to: Step.GENERATE },
      { from: Step.GENERATE, to: Step.RESULT },
      { from: Step.RESULT, to: Step.SELECT_MODE }
    ];

    for (const { from, to } of happyPath) {
      expect(canTransition(from, to)).toBe(true);
      expect(() => validateTransition(from, to)).not.toThrow();
    }
  });

  it('뒤로가기 시나리오가 올바르게 동작해야 한다', () => {
    const backwardPath = [
      { from: Step.PAYMENT, to: Step.MATCH },
      { from: Step.MATCH, to: Step.UPLOAD },
      { from: Step.UPLOAD, to: Step.SELECT_MODE }
    ];

    for (const { from, to } of backwardPath) {
      expect(canTransition(from, to)).toBe(true);
      expect(() => validateTransition(from, to)).not.toThrow();
    }
  });

  it('단계 건너뛰기가 불가능해야 한다', () => {
    const invalidSkips = [
      { from: Step.SELECT_MODE, to: Step.MATCH },
      { from: Step.SELECT_MODE, to: Step.PAYMENT },
      { from: Step.UPLOAD, to: Step.PAYMENT },
      { from: Step.MATCH, to: Step.GENERATE }
    ];

    for (const { from, to } of invalidSkips) {
      expect(canTransition(from, to)).toBe(false);
      expect(() => validateTransition(from, to)).toThrow(TransitionError);
    }
  });
});

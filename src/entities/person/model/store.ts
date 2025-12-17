/**
 * Person Store — Zustand 기반 사람 마커 상태 관리
 *
 * @description
 * MATCH/EXPRESSION Step에서 사용하는 사람 마커 데이터 관리
 * - 최대 5명까지 추가 가능
 * - 최소 1명은 유지되어야 함
 * - 색상은 고정 순서로 배정
 * - Step 이동 시에도 상태 유지
 */

import type {} from '@redux-devtools/extension';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  type MarkerTransform,
  PERSON_COLOR_ORDER,
  type Person,
  PersonColor,
  type PersonColor as PersonColorType,
  type PersonState
} from './types';

// =============================================================================
// Constants
// =============================================================================

const MAX_PERSONS = 5;
const MIN_PERSONS = 1;

/**
 * 사람 추가 시 마커 기본 스택 간격 (정규화 X 좌표)
 * - 0.06 ≒ 컨테이너 높이 500px 기준 약 30px
 * - "반쯤 겹치게" 보이도록 기본 마커(60px) 대비 절반 정도 겹침을 유도
 */
const DEFAULT_STACK_DELTA_X = 0.06;

/**
 * 기본 마커 위치 (이미지 좌측 하단 근처)
 */
const DEFAULT_TRANSFORM: MarkerTransform = {
  x: 0.2,
  y: 0.7,
  scale: 1,
  rotation: 0,
  imageScale: 1.5,
  imageOffsetX: 0,
  imageOffsetY: 0
};

// =============================================================================
// Helper Functions
// =============================================================================

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/**
 * 고유 ID 생성
 */
function generateId(): string {
  return `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 사용 가능한 다음 색상 찾기
 * @param usedColors 현재 사용 중인 색상 목록
 * @returns 사용 가능한 첫 번째 색상 또는 null
 */
function getNextAvailableColor(usedColors: PersonColorType[]): PersonColorType | null {
  for (const color of PERSON_COLOR_ORDER) {
    if (!usedColors.includes(color)) {
      return color;
    }
  }
  return null;
}

function getFirstPersonColor(): PersonColorType {
  return PERSON_COLOR_ORDER[0] ?? PersonColor.BLUE;
}

function revokeBlobUrl(url: string | null) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

function revokeAllFacePhotoUrls(persons: Person[]) {
  for (const person of persons) {
    revokeBlobUrl(person.facePhotoUrl);
  }
}

function createFirstPerson(transform: MarkerTransform): Person {
  return {
    id: generateId(),
    color: getFirstPersonColor(),
    facePhoto: null,
    facePhotoUrl: null,
    transform
  };
}

/**
 * 새 사람의 기본 위치 계산
 * - 기본은 Active 마커 기준으로 오른쪽으로 살짝 이동해 "반쯤 겹치게" 배치
 * - Active가 없으면 마지막 사람을 기준으로 배치
 */
function getDefaultTransformForNewPerson(base: MarkerTransform): MarkerTransform {
  return {
    x: clamp01(base.x + DEFAULT_STACK_DELTA_X),
    y: clamp01(base.y),
    scale: 1,
    rotation: 0,
    imageScale: DEFAULT_TRANSFORM.imageScale,
    imageOffsetX: 0,
    imageOffsetY: 0
  };
}

// =============================================================================
// Store Actions Interface
// =============================================================================

interface PersonActions {
  /** 초기화 (UPLOAD → MATCH 최초 진입 시 1회만) */
  initialize: () => void;

  /** 강제 재초기화 (초기화 버튼 클릭 시 - 상태 삭제 후 재초기화) */
  reinitialize: () => void;

  /** 사람 추가 (최대 5명) */
  addPerson: () => void;

  /** 사람 삭제 (최소 1명 유지) */
  removePerson: (id: string) => void;

  /** Active 사람 변경 */
  setActivePerson: (id: string | null) => void;

  /** 얼굴 사진 업로드/교체 */
  setFacePhoto: (id: string, file: File) => void;

  /** 마커 위치 업데이트 */
  updateTransform: (id: string, transform: Partial<MarkerTransform>) => void;

  /** 전체 리셋 (워크플로우 처음부터 다시 시작 시) */
  reset: () => void;
}

export type PersonStore = PersonState & PersonActions;

// =============================================================================
// Initial State
// =============================================================================

const initialState: PersonState = {
  persons: [],
  activePersonId: null,
  initialized: false
};

// =============================================================================
// Store Definition
// =============================================================================

type SetPersonStore = (partial: Partial<PersonStore>) => void;
type GetPersonStore = () => PersonStore;

function createInitialize(set: SetPersonStore, get: GetPersonStore) {
  return () => {
    const { initialized } = get();

    // 이미 초기화된 경우 스킵 (EXPRESSION에서 돌아올 때 리셋 방지)
    if (initialized) {
      return;
    }

    const firstPerson = createFirstPerson(DEFAULT_TRANSFORM);

    set({
      persons: [firstPerson],
      activePersonId: firstPerson.id,
      initialized: true
    });
  };
}

function createReinitialize(set: SetPersonStore, get: GetPersonStore) {
  return () => {
    const { persons } = get();
    revokeAllFacePhotoUrls(persons);

    const firstPerson = createFirstPerson(DEFAULT_TRANSFORM);

    set({
      persons: [firstPerson],
      activePersonId: firstPerson.id,
      initialized: true
    });
  };
}

function createAddPerson(set: SetPersonStore, get: GetPersonStore) {
  return () => {
    const { persons, activePersonId } = get();

    if (persons.length >= MAX_PERSONS) {
      console.warn(`Maximum ${MAX_PERSONS} persons allowed`);
      return;
    }

    const usedColors = persons.map((p) => p.color);
    const nextColor = getNextAvailableColor(usedColors);

    if (!nextColor) {
      console.warn('No available colors');
      return;
    }

    const basePerson =
      persons.find((p) => p.id === activePersonId) ?? persons[persons.length - 1] ?? null;
    const baseTransform = basePerson?.transform ?? DEFAULT_TRANSFORM;

    const newPerson: Person = {
      id: generateId(),
      color: nextColor,
      facePhoto: null,
      facePhotoUrl: null,
      transform: getDefaultTransformForNewPerson(baseTransform)
    };

    set({
      persons: [...persons, newPerson],
      activePersonId: newPerson.id
    });
  };
}

function createRemovePerson(set: SetPersonStore, get: GetPersonStore) {
  return (id: string) => {
    const { persons, activePersonId } = get();

    if (persons.length <= MIN_PERSONS) {
      console.warn(`Minimum ${MIN_PERSONS} person required`);
      return;
    }

    const personToRemove = persons.find((p) => p.id === id);
    revokeBlobUrl(personToRemove?.facePhotoUrl ?? null);

    const newPersons = persons.filter((p) => p.id !== id);
    const newActiveId = activePersonId === id ? (newPersons[0]?.id ?? null) : activePersonId;

    set({
      persons: newPersons,
      activePersonId: newActiveId
    });
  };
}

function createSetFacePhoto(set: SetPersonStore, get: GetPersonStore) {
  return (id: string, file: File) => {
    const { persons } = get();

    const newPersons = persons.map((p) => {
      if (p.id !== id) return p;

      revokeBlobUrl(p.facePhotoUrl);

      return {
        ...p,
        facePhoto: file,
        facePhotoUrl: URL.createObjectURL(file)
      };
    });

    set({ persons: newPersons });
  };
}

function createUpdateTransform(set: SetPersonStore, get: GetPersonStore) {
  return (id: string, transform: Partial<MarkerTransform>) => {
    const { persons } = get();

    const newPersons = persons.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        transform: {
          ...p.transform,
          ...transform
        }
      };
    });

    set({ persons: newPersons });
  };
}

function createReset(set: SetPersonStore, get: GetPersonStore) {
  return () => {
    const { persons } = get();
    revokeAllFacePhotoUrls(persons);
    set(initialState);
  };
}

export const usePersonStore = create<PersonStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      initialize: createInitialize(set, get),
      reinitialize: createReinitialize(set, get),
      addPerson: createAddPerson(set, get),
      removePerson: createRemovePerson(set, get),

      setActivePerson: (id: string | null) => {
        set({ activePersonId: id });
      },

      setFacePhoto: createSetFacePhoto(set, get),
      updateTransform: createUpdateTransform(set, get),
      reset: createReset(set, get)
    }),
    {
      name: 'person-store'
    }
  )
);

// =============================================================================
// Selectors
// =============================================================================

export const selectPersons = (state: PersonStore) => state.persons;
export const selectActivePersonId = (state: PersonStore) => state.activePersonId;
export const selectActivePerson = (state: PersonStore) =>
  state.persons.find((p) => p.id === state.activePersonId) ?? null;
export const selectPersonById = (id: string) => (state: PersonStore) =>
  state.persons.find((p) => p.id === id) ?? null;
export const selectCanAddPerson = (state: PersonStore) => state.persons.length < MAX_PERSONS;
export const selectCanRemovePerson = (state: PersonStore) => state.persons.length > MIN_PERSONS;
export const selectInitialized = (state: PersonStore) => state.initialized;

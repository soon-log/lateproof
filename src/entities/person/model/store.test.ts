import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  selectActivePersonId,
  selectCanAddPerson,
  selectCanRemovePerson,
  selectInitialized,
  selectPersons,
  usePersonStore
} from './store';
import { PERSON_COLOR_ORDER, PersonColor } from './types';

beforeAll(() => {
  if (!('createObjectURL' in URL)) {
    // @ts-expect-error - test env polyfill
    URL.createObjectURL = vi.fn(() => 'blob:mock');
  }
  if (!('revokeObjectURL' in URL)) {
    // @ts-expect-error - test env polyfill
    URL.revokeObjectURL = vi.fn(() => {});
  }
});

beforeEach(() => {
  usePersonStore.getState().reset();
});

describe('usePersonStore', () => {
  it('초기 상태는 비어 있고 initialized=false이다', () => {
    const state = usePersonStore.getState();
    expect(selectPersons(state)).toEqual([]);
    expect(selectActivePersonId(state)).toBeNull();
    expect(selectInitialized(state)).toBe(false);
  });

  it('initialize는 최초 1회만 사람 1명을 생성한다', () => {
    usePersonStore.getState().initialize();
    const afterFirst = usePersonStore.getState();

    expect(afterFirst.persons).toHaveLength(1);
    expect(afterFirst.activePersonId).toBe(afterFirst.persons[0]?.id);
    expect(afterFirst.initialized).toBe(true);
    expect(afterFirst.persons[0]?.color).toBe(PERSON_COLOR_ORDER[0]);

    const firstId = afterFirst.persons[0]?.id;
    usePersonStore.getState().initialize();
    const afterSecond = usePersonStore.getState();

    expect(afterSecond.persons).toHaveLength(1);
    expect(afterSecond.persons[0]?.id).toBe(firstId);
  });

  it('addPerson은 최대 5명까지 추가하고, 색상은 순서대로 할당한다', () => {
    usePersonStore.getState().initialize();

    usePersonStore.getState().addPerson();
    usePersonStore.getState().addPerson();
    usePersonStore.getState().addPerson();
    usePersonStore.getState().addPerson();

    const { persons } = usePersonStore.getState();
    expect(persons).toHaveLength(5);
    expect(persons.map((p) => p.color)).toEqual(PERSON_COLOR_ORDER);
    expect(selectCanAddPerson(usePersonStore.getState())).toBe(false);
  });

  it('addPerson은 Active 마커 기준으로 오른쪽으로 반쯤 겹치게 배치한다', () => {
    usePersonStore.getState().initialize();
    const before = usePersonStore.getState();
    const base = before.persons[0];
    if (!base) {
      throw new Error('initialize 이후에는 persons[0]가 존재해야 합니다.');
    }

    usePersonStore.getState().addPerson();
    const after = usePersonStore.getState();
    const added = after.persons[1];
    if (!added) {
      throw new Error('addPerson 이후에는 persons[1]가 존재해야 합니다.');
    }

    expect(added.transform.x).toBeCloseTo(base.transform.x + 0.06, 6);
    expect(added.transform.y).toBeCloseTo(base.transform.y, 6);
    expect(added.transform.imageScale).toBe(1.5);
  });

  it('removePerson은 최소 1명을 유지하고, Active 삭제 시 첫 번째 사람으로 변경한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    usePersonStore.getState().initialize();
    const firstId = usePersonStore.getState().persons[0]?.id;

    usePersonStore.getState().removePerson(firstId ?? '');
    expect(usePersonStore.getState().persons).toHaveLength(1);
    expect(warn).toHaveBeenCalled();

    usePersonStore.getState().addPerson();
    const stateWithTwo = usePersonStore.getState();
    const secondId = stateWithTwo.persons[1]?.id;
    expect(stateWithTwo.activePersonId).toBe(secondId);

    usePersonStore.getState().removePerson(secondId ?? '');
    const afterRemoveActive = usePersonStore.getState();
    expect(afterRemoveActive.persons).toHaveLength(1);
    expect(afterRemoveActive.activePersonId).toBe(afterRemoveActive.persons[0]?.id);
  });

  it('setFacePhoto는 facePhoto/facePhotoUrl을 설정하고, 기존 URL을 해제한다', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValueOnce('blob:1');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    usePersonStore.getState().initialize();
    const id = usePersonStore.getState().persons[0]?.id;
    if (!id) {
      throw new Error('initialize 이후에는 persons[0].id가 존재해야 합니다.');
    }

    const file1 = new File(['a'], 'a.png', { type: 'image/png' });
    usePersonStore.getState().setFacePhoto(id, file1);

    const after1 = usePersonStore.getState().persons[0];
    if (!after1) {
      throw new Error('persons[0]가 존재해야 합니다.');
    }
    expect(after1.facePhoto).toBe(file1);
    expect(after1.facePhotoUrl).toBe('blob:1');
    expect(createObjectURL).toHaveBeenCalledWith(file1);

    createObjectURL.mockReturnValueOnce('blob:2');
    const file2 = new File(['b'], 'b.png', { type: 'image/png' });
    usePersonStore.getState().setFacePhoto(id, file2);

    const after2 = usePersonStore.getState().persons[0];
    if (!after2) {
      throw new Error('persons[0]가 존재해야 합니다.');
    }
    expect(after2.facePhoto).toBe(file2);
    expect(after2.facePhotoUrl).toBe('blob:2');
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:1');
  });

  it('updateTransform은 기존 transform에 부분 업데이트를 병합한다', () => {
    usePersonStore.getState().initialize();
    const id = usePersonStore.getState().persons[0]?.id;
    if (!id) {
      throw new Error('initialize 이후에는 persons[0].id가 존재해야 합니다.');
    }

    usePersonStore.getState().updateTransform(id, { x: 0.9, rotation: 180, imageScale: 1.2 });
    const updated = usePersonStore.getState().persons[0];
    if (!updated) {
      throw new Error('persons[0]가 존재해야 합니다.');
    }

    expect(updated.transform.x).toBe(0.9);
    expect(updated.transform.rotation).toBe(180);
    expect(updated.transform.imageScale).toBe(1.2);
    expect(updated.transform.y).toBeGreaterThan(0);
  });

  it('reset은 상태를 초기화하고, blob URL을 해제한다', () => {
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    usePersonStore.getState().initialize();
    const id = usePersonStore.getState().persons[0]?.id;
    if (!id) {
      throw new Error('initialize 이후에는 persons[0].id가 존재해야 합니다.');
    }
    const file = new File(['x'], 'x.png', { type: 'image/png' });
    vi.spyOn(URL, 'createObjectURL').mockReturnValueOnce('blob:to-revoke');
    usePersonStore.getState().setFacePhoto(id, file);

    usePersonStore.getState().reset();
    const state = usePersonStore.getState();

    expect(state.persons).toHaveLength(0);
    expect(state.activePersonId).toBeNull();
    expect(state.initialized).toBe(false);
    expect(selectCanRemovePerson(state)).toBe(false);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:to-revoke');
  });

  it('setActivePerson은 activePersonId를 변경한다', () => {
    usePersonStore.getState().initialize();
    usePersonStore.getState().addPerson();

    const { persons } = usePersonStore.getState();
    const targetId = persons[0]?.id;

    if (!targetId) {
      throw new Error('persons[0].id가 존재해야 합니다.');
    }
    usePersonStore.getState().setActivePerson(targetId);
    expect(usePersonStore.getState().activePersonId).toBe(targetId);
  });

  it('색상 타입은 as const 패턴을 사용한다', () => {
    expect(PersonColor.BLUE).toBe('BLUE');
  });
});

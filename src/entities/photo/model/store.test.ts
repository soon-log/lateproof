import { describe, expect, it } from 'vitest';
import { selectPhotoFile, usePhotoStore } from './store';

describe('usePhotoStore', () => {
  it('초기 상태는 file=null이다', () => {
    usePhotoStore.getState().clear();
    expect(usePhotoStore.getState().file).toBeNull();
    expect(selectPhotoFile(usePhotoStore.getState())).toBeNull();
  });

  it('setFile로 파일을 저장한다', () => {
    usePhotoStore.getState().clear();
    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    usePhotoStore.getState().setFile(file);
    expect(usePhotoStore.getState().file).toBe(file);
  });

  it('clear로 초기화한다', () => {
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    usePhotoStore.getState().setFile(file);

    usePhotoStore.getState().clear();
    expect(usePhotoStore.getState().file).toBeNull();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo/model/store';
import { Step, useStepStore } from '@/entities/step';
import { MatchPhotoView } from './match-photo-view';

const { validateFacePhotoMock, toastErrorMock } = vi.hoisted(() => ({
  validateFacePhotoMock: vi.fn(),
  toastErrorMock: vi.fn()
}));

vi.mock('../model/validate-face-photo', () => ({
  validateFacePhoto: validateFacePhotoMock
}));

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    error: toastErrorMock,
    success: vi.fn(),
    loading: vi.fn(),
    promise: vi.fn()
  }
}));

function createPerson(id: string, overrides: Partial<Person> = {}): Person {
  return {
    id,
    color: PersonColor.BLUE,
    facePhoto: null,
    facePhotoUrl: null,
    transform: {
      x: 0.2,
      y: 0.7,
      scale: 1,
      rotation: 0,
      imageScale: 1.5,
      imageOffsetX: 0,
      imageOffsetY: 0
    },
    expression: null,
    ...overrides
  };
}

beforeEach(() => {
  usePhotoStore.getState().clear();
  usePersonStore.getState().reset();
  useStepStore.getState().reset();
  validateFacePhotoMock.mockReset();
  toastErrorMock.mockReset();

  // JSDOM 환경에서 URL.createObjectURL이 없을 수 있어 안전하게 스텁
  if (!('createObjectURL' in URL)) {
    // @ts-expect-error - test env polyfill
    URL.createObjectURL = () => 'blob:mock';
  }
  if (!('revokeObjectURL' in URL)) {
    // @ts-expect-error - test env polyfill
    URL.revokeObjectURL = () => {};
  }
});

describe('MatchPhotoView', () => {
  it('베이스 이미지가 없으면 안내 문구가 보인다', () => {
    render(<MatchPhotoView />);
    expect(
      screen.getByText('베이스 이미지가 없습니다. UPLOAD Step으로 돌아가세요.')
    ).toBeInTheDocument();
  });

  it('얼굴 사진이 모두 업로드되지 않으면 다음 버튼이 비활성화된다', () => {
    usePhotoStore.getState().setFile(new File(['x'], 'base.png', { type: 'image/png' }));
    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p1',
      persons: [createPerson('p1'), createPerson('p2', { facePhoto: new File(['x'], 'f.png') })]
    });

    render(<MatchPhotoView />);

    expect(screen.getByRole('button', { name: '표정 선택하기' })).toBeDisabled();
  });

  it('얼굴 사진이 모두 업로드되면 다음 버튼이 활성화되고 클릭 시 nextStep을 호출한다', async () => {
    const user = userEvent.setup();
    const nextStep = vi.fn();
    useStepStore.setState({ nextStep });

    usePhotoStore.getState().setFile(new File(['x'], 'base.png', { type: 'image/png' }));
    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p1',
      persons: [
        createPerson('p1', { facePhoto: new File(['x'], 'f1.png', { type: 'image/png' }) }),
        createPerson('p2', { facePhoto: new File(['x'], 'f2.png', { type: 'image/png' }) })
      ]
    });

    render(<MatchPhotoView />);

    const button = screen.getByRole('button', { name: '표정 선택하기' });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(nextStep).toHaveBeenCalledWith(Step.EXPRESSION, 'MATCH 완료');
  });

  it('검증 실패 시 toast.error를 표시하고 얼굴 사진을 저장하지 않는다', async () => {
    const user = userEvent.setup();
    validateFacePhotoMock.mockResolvedValue({
      success: false,
      hasFace: false,
      alertMessage: '테스트 오류 메시지'
    });

    usePhotoStore.getState().setFile(new File(['x'], 'base.png', { type: 'image/png' }));
    usePersonStore.setState({
      initialized: true,
      activePersonId: 'p1',
      persons: [createPerson('p1')]
    });

    const setFacePhotoSpy = vi.spyOn(usePersonStore.getState(), 'setFacePhoto');

    render(<MatchPhotoView />);

    const uploadButtons = screen.getAllByRole('button', { name: '사진 업로드' });
    const firstUploadButton = uploadButtons[0];
    expect(firstUploadButton).toBeTruthy();
    if (!firstUploadButton) {
      throw new Error('사진 업로드 버튼이 최소 1개 존재해야 합니다.');
    }
    await user.click(firstUploadButton);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(fileInput).not.toBeNull();

    await user.upload(
      fileInput as HTMLInputElement,
      new File(['x'], 'face.jpg', { type: 'image/jpeg' })
    );

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('테스트 오류 메시지');
    });

    expect(setFacePhotoSpy).not.toHaveBeenCalled();
  });
});

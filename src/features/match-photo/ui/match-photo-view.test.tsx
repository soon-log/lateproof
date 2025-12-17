import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Person } from '@/entities/person';
import { PersonColor, usePersonStore } from '@/entities/person';
import { usePhotoStore } from '@/entities/photo/model/store';
import { Step, useStepStore } from '@/entities/step';
import { MatchPhotoView } from './match-photo-view';

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
    ...overrides
  };
}

beforeEach(() => {
  usePhotoStore.getState().clear();
  usePersonStore.getState().reset();
  useStepStore.getState().reset();

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
});

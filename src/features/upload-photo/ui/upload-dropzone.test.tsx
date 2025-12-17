import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  UploadDropzoneStatus,
  type UploadDropzoneViewModel
} from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzone } from './upload-dropzone';

const createViewModel = (
  override: Partial<UploadDropzoneViewModel> = {}
): UploadDropzoneViewModel =>
  ({
    rootProps: {
      role: 'button',
      tabIndex: 0,
      'aria-label': '업로드 영역',
      onClick: vi.fn()
    } as unknown as UploadDropzoneViewModel['rootProps'],
    inputProps: {
      'aria-label': '파일 입력'
    } as unknown as UploadDropzoneViewModel['inputProps'],
    status: UploadDropzoneStatus.IDLE,
    primaryText: '사진을 여기로 끌어다 놓거나',
    secondaryText: '클릭해서 선택해주세요',
    isUploading: false,
    fileRejections: [],
    ...override
  }) satisfies UploadDropzoneViewModel;

describe('UploadDropzone', () => {
  it('기본(Idle) 상태 텍스트가 렌더링된다', () => {
    render(<UploadDropzone {...createViewModel()} />);

    expect(screen.getByText('사진을 여기로 끌어다 놓거나')).toBeInTheDocument();
    expect(screen.getByText('클릭해서 선택해주세요')).toBeInTheDocument();
  });

  it('업로드 중이면 로딩 오버레이가 보인다', () => {
    render(<UploadDropzone {...createViewModel({ isUploading: true })} />);

    expect(screen.getByText('사진을 올리고 있어요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '업로드 영역' })).toHaveClass('pointer-events-none');
  });

  it('ACTIVE 상태면 톤 클래스가 변경된다', () => {
    render(<UploadDropzone {...createViewModel({ status: UploadDropzoneStatus.ACTIVE })} />);
    expect(screen.getByRole('button', { name: '업로드 영역' })).toHaveClass('border-brand-500');
  });

  it('ERROR 상태면 톤 클래스가 변경된다', () => {
    render(<UploadDropzone {...createViewModel({ status: UploadDropzoneStatus.ERROR })} />);
    expect(screen.getByRole('button', { name: '업로드 영역' })).toHaveClass('border-error');
  });
});

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { UploadDropzoneViewModel } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzoneStatus } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadPhotoView } from './upload-photo-view';

const createDropzone = (override: Partial<UploadDropzoneViewModel> = {}): UploadDropzoneViewModel =>
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

describe('UploadPhotoView', () => {
  it('파일이 없으면 드롭존과 팁을 보여주고 다음 버튼은 숨긴다', () => {
    render(
      <UploadPhotoView
        flow={{
          selectedFile: null,
          previewUrl: null,
          dropzone: createDropzone(),
          handleRemoveFile: () => {},
          handleNext: () => {}
        }}
      />
    );

    expect(screen.getByRole('button', { name: '업로드 영역' })).toBeInTheDocument();
    expect(screen.getByText('💡 좋은 사진을 선택하는 팁')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다음으로' })).not.toBeInTheDocument();
  });

  it('파일이 있으면 프리뷰와 다음 버튼을 보여준다', () => {
    const file = new File(['x'], 'photo.png', { type: 'image/png' });

    render(
      <UploadPhotoView
        flow={{
          selectedFile: file,
          previewUrl: 'https://example.com/photo.png',
          dropzone: createDropzone(),
          handleRemoveFile: () => {},
          handleNext: () => {}
        }}
      />
    );

    expect(screen.getByRole('img', { name: '업로드된 사진 미리보기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음으로' })).toBeInTheDocument();
  });

  it('다시 선택 클릭 시 handleRemoveFile을 호출한다', async () => {
    const user = userEvent.setup();
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    const handleRemoveFile = vi.fn();

    render(
      <UploadPhotoView
        flow={{
          selectedFile: file,
          previewUrl: 'https://example.com/photo.png',
          dropzone: createDropzone(),
          handleRemoveFile,
          handleNext: () => {}
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: '다시 선택' }));
    expect(handleRemoveFile).toHaveBeenCalledTimes(1);
  });

  it('다음으로 클릭 시 handleNext를 호출한다', async () => {
    const user = userEvent.setup();
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    const handleNext = vi.fn();

    render(
      <UploadPhotoView
        flow={{
          selectedFile: file,
          previewUrl: 'https://example.com/photo.png',
          dropzone: createDropzone(),
          handleRemoveFile: () => {},
          handleNext
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: '다음으로' }));
    expect(handleNext).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { UploadDropzoneViewModel } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadDropzoneStatus } from '@/features/upload-photo/model/use-upload-dropzone';
import { UploadPhotoPage } from './upload-photo-page';

describe('UploadPhotoPage', () => {
  it('헤더와 업로드 드롭존을 렌더링한다', () => {
    const dropzone: UploadDropzoneViewModel = {
      rootProps: {
        role: 'button',
        tabIndex: 0,
        'aria-label': '업로드 영역'
      } as unknown as UploadDropzoneViewModel['rootProps'],
      inputProps: {
        'aria-label': '파일 입력'
      } as unknown as UploadDropzoneViewModel['inputProps'],
      status: UploadDropzoneStatus.IDLE,
      primaryText: '사진을 여기로 끌어다 놓거나',
      secondaryText: '클릭해서 선택해주세요',
      isUploading: false,
      fileRejections: []
    };

    render(
      <UploadPhotoPage
        flow={{
          selectedFile: null,
          previewUrl: null,
          dropzone,
          handleRemoveFile: () => {},
          handleNext: () => {}
        }}
      />
    );

    expect(screen.getByText('사진을 선택해주세요')).toBeInTheDocument();
    expect(
      screen.getByText('배경이 잘 나온 사진을 선택하면 더 자연스러운 결과를 얻을 수 있어요')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '업로드 영역' })).toBeInTheDocument();
  });
});

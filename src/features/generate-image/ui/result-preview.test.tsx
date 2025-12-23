import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResultPreview } from './result-preview';

const sampleImage = {
  id: 'img-1',
  dataBase64: 'base64',
  mimeType: 'image/png'
};

describe('ResultPreview', () => {
  it('이미지가 없으면 안내 메시지를 표시한다', () => {
    render(
      <ResultPreview images={[]} status="idle" onDownload={vi.fn()} onDownloadAll={vi.fn()} />
    );

    expect(screen.getByText(/아직 결과가 없어요/)).toBeInTheDocument();
  });

  it('다운로드 버튼 클릭 시 핸들러가 호출된다', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(
      <ResultPreview
        images={[sampleImage]}
        status="success"
        onDownload={onDownload}
        onDownloadAll={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: '다운로드' }));

    expect(onDownload).toHaveBeenCalledWith(sampleImage, 0);
  });
});

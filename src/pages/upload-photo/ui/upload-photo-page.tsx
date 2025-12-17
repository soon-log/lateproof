import { UploadPhotoView } from '@/features/upload-photo';
import type { useUploadPhotoFlow } from '@/features/upload-photo/model/use-upload-photo-flow';
import { StepHeader } from '@/widgets/step-header';

type UploadPhotoFlow = ReturnType<typeof useUploadPhotoFlow>;

type UploadPhotoPageProps = {
  /**
   * 테스트/스토리에서 상태 주입을 위한 옵션.
   * 기본값은 `UploadPhotoView` 내부 훅을 사용한다.
   */
  flow?: UploadPhotoFlow;
};

export function UploadPhotoPage({ flow }: UploadPhotoPageProps) {
  return (
    <div className="w-full">
      <StepHeader
        title="사진을 선택해주세요"
        description="배경이 잘 나온 사진을 선택하면 더 자연스러운 결과를 얻을 수 있어요"
      />
      <UploadPhotoView flow={flow} />
    </div>
  );
}

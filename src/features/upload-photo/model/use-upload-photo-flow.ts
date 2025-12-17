import { usePhotoStore } from '@/entities/photo';
import { Step, useStepStore } from '@/entities/step';
import { usePhotoUpload } from './use-photo-upload';

export function useUploadPhotoFlow() {
  const { nextStep } = useStepStore();
  const { setFile } = usePhotoStore();

  return usePhotoUpload({
    onNext: ({ file }) => {
      setFile(file);
      nextStep(Step.MATCH, '사진 선택 완료');
    }
  });
}

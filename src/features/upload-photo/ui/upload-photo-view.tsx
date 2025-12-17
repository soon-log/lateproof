'use client';

import { motion } from 'framer-motion';
import { HelperText } from '@/features/upload-photo/ui/helper-text';
import { NextStepButton } from '@/shared/components/ui';
import { useUploadPhotoFlow } from '../model/use-upload-photo-flow';
import { PhotoPreview } from './photo-preview';
import { UploadDropzone } from './upload-dropzone';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

type UploadPhotoFlow = ReturnType<typeof useUploadPhotoFlow>;

type UploadPhotoViewProps = {
  /**
   * 테스트/스토리에서 상태 주입을 위한 옵션.
   * 기본값은 `useUploadPhotoFlow()` 결과를 사용한다.
   */
  flow?: UploadPhotoFlow;
};

function UploadPhotoViewContent({
  selectedFile,
  previewUrl,
  dropzone,
  handleRemoveFile,
  handleNext
}: UploadPhotoFlow) {
  return (
    <motion.div className="w-full" initial="initial" animate="animate" exit="exit">
      <motion.div className="w-full" variants={staggerContainer}>
        {/* Upload Area or Preview */}
        <motion.div variants={fadeInUp}>
          {selectedFile && previewUrl ? (
            <PhotoPreview previewUrl={previewUrl} onRemove={handleRemoveFile} />
          ) : (
            <>
              <UploadDropzone {...dropzone} />
              <HelperText className="mt-4" />
            </>
          )}
        </motion.div>

        {/* Next Button */}
        {selectedFile && (
          <div className="mt-8">
            <NextStepButton onClick={handleNext} disabled={!selectedFile} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function UploadPhotoViewWithFlow() {
  const flow = useUploadPhotoFlow();
  return <UploadPhotoViewContent {...flow} />;
}

export function UploadPhotoView({ flow }: UploadPhotoViewProps) {
  if (flow) return <UploadPhotoViewContent {...flow} />;
  return <UploadPhotoViewWithFlow />;
}

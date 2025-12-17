'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  type MarkerTransform,
  selectActivePersonId,
  selectCanAddPerson,
  selectCanRemovePerson,
  selectInitialized,
  selectPersons,
  usePersonStore
} from '@/entities/person';
import { selectPhotoFile, usePhotoStore } from '@/entities/photo/model/store';
import { Step } from '@/entities/step/model/step';
import { useStepStore } from '@/entities/step/model/store';
import { NextStepButton } from '@/shared/components/ui';
import { validateFacePhoto } from '../model/validate-face-photo';
import { ImageCanvas } from './image-canvas';
import { PersonListPanel } from './person-list-panel';

function useEnsurePersonInitialized(initialized: boolean, initialize: () => void) {
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);
}

function useObjectUrl(file: File | null) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  return url;
}

type UpdateTransform = (id: string, transform: Partial<MarkerTransform>) => void;

function usePersonTransformHandlers(updateTransform: UpdateTransform) {
  const handlePositionChange = useCallback(
    (id: string, x: number, y: number) => {
      updateTransform(id, { x, y });
    },
    [updateTransform]
  );

  const handleScaleChange = useCallback(
    (id: string, scale: number) => {
      updateTransform(id, { scale });
    },
    [updateTransform]
  );

  const handleRotationChange = useCallback(
    (id: string, rotation: number) => {
      updateTransform(id, { rotation });
    },
    [updateTransform]
  );

  const handleImageOffsetChange = useCallback(
    (id: string, offsetX: number, offsetY: number) => {
      updateTransform(id, { imageOffsetX: offsetX, imageOffsetY: offsetY });
    },
    [updateTransform]
  );

  const handleImageScaleChange = useCallback(
    (id: string, imageScale: number) => {
      updateTransform(id, { imageScale });
    },
    [updateTransform]
  );

  return {
    handlePositionChange,
    handleScaleChange,
    handleRotationChange,
    handleImageOffsetChange,
    handleImageScaleChange
  };
}

export function MatchPhotoView() {
  const baseFile = usePhotoStore(selectPhotoFile);
  const persons = usePersonStore(selectPersons);
  const activePersonId = usePersonStore(selectActivePersonId);
  const canAddPerson = usePersonStore(selectCanAddPerson);
  const canRemovePerson = usePersonStore(selectCanRemovePerson);
  const initialized = usePersonStore(selectInitialized);

  const {
    initialize,
    reinitialize,
    addPerson,
    removePerson,
    setActivePerson,
    setFacePhoto,
    updateTransform
  } = usePersonStore();
  const nextStep = useStepStore((s) => s.nextStep);

  // MATCH Step 최초 진입 시 초기화 (EXPRESSION에서 돌아올 때는 스킵)
  useEnsurePersonInitialized(initialized, initialize);

  // Base image URL 생성
  const baseImageUrl = useObjectUrl(baseFile);

  // 마커 선택 핸들러 (Active 상태 전환)
  const handleMarkerSelect = useCallback(
    (personId: string) => {
      setActivePerson(personId);
    },
    [setActivePerson]
  );

  const {
    handlePositionChange,
    handleScaleChange,
    handleRotationChange,
    handleImageOffsetChange,
    handleImageScaleChange
  } = usePersonTransformHandlers(updateTransform);

  // 패널에서 업로드 핸들러
  const handlePanelUploadPhoto = useCallback(
    (id: string, file: File) => {
      void (async () => {
        const result = await validateFacePhoto(file);

        if (!result.success) {
          toast.error(
            result.alertMessage ?? '얼굴을 인식할 수 없습니다. 다른 사진을 업로드해주세요.'
          );
          return;
        }

        setFacePhoto(id, file);
      })();
    },
    [setFacePhoto]
  );

  // 초기화 핸들러
  const handleReset = useCallback(() => {
    reinitialize();
  }, [reinitialize]);

  // 다음 Step으로 이동
  const handleNext = useCallback(() => {
    nextStep(Step.EXPRESSION, 'MATCH 완료');
  }, [nextStep]);

  // 다음 버튼 활성화 조건: 최소 1명 이상이고 모두 얼굴 사진이 있어야 함
  const canProceed = persons.length > 0 && persons.every((p) => p.facePhoto !== null);

  if (!baseFile) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-neutral-500">베이스 이미지가 없습니다. UPLOAD Step으로 돌아가세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 이미지 캔버스 */}
      <ImageCanvas
        baseImageUrl={baseImageUrl}
        persons={persons}
        activePersonId={activePersonId}
        onPositionChange={handlePositionChange}
        onScaleChange={handleScaleChange}
        onRotationChange={handleRotationChange}
        onImageOffsetChange={handleImageOffsetChange}
        onImageScaleChange={handleImageScaleChange}
        onMarkerSelect={handleMarkerSelect}
      />

      {/* 하단 사람 목록 패널 */}
      <PersonListPanel
        persons={persons}
        activePersonId={activePersonId}
        canAddPerson={canAddPerson}
        canRemovePerson={canRemovePerson}
        onSelectPerson={setActivePerson}
        onAddPerson={addPerson}
        onRemovePerson={removePerson}
        onUploadPhoto={handlePanelUploadPhoto}
        onReset={handleReset}
      />

      {/* 안내 메시지 */}
      <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-blue-700 text-sm">
          💡 <strong>Tip:</strong> 마커를 클릭하여 선택하고, 드래그로 위치를 조정하세요. 선택된
          마커의 핸들로 크기/회전/얼굴 위치/얼굴 크기를 조정할 수 있습니다. 모든 인물의 얼굴 사진을
          업로드해야 다음 단계로 진행할 수 있습니다.
        </p>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-2">
        <NextStepButton onClick={handleNext} disabled={!canProceed}>
          표정 선택하기
        </NextStepButton>
      </div>
    </div>
  );
}

'use client';

import { useCallback, useMemo, useState } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import {
  buildNanobananaPrompt,
  selectPersons,
  toNanobananaInput,
  usePersonStore
} from '@/entities/person';
import { selectPhotoFile, usePhotoStore } from '@/entities/photo';
import type {
  NanobananaError,
  NanobananaImage,
  NanobananaModel
} from '@/features/generate-image/api';
import { NanobananaModel as NanobananaModelValues } from '@/features/generate-image/api';
import { Button } from '@/shared/components/ui/button';
import { useGenerateImage } from '../model/use-generate-image';
import { PromptForm } from './prompt-form';
import { ResultPreview } from './result-preview';

function buildPromptText(prompt: string, negativePrompt: string) {
  return `${prompt}\n\n[Negative Prompt]\n${negativePrompt}`;
}

function stripDataUrlPrefix(value: string) {
  return value.replace(/^data:[^;]+;base64,/, '');
}

function base64ToBlob(dataBase64: string, mimeType: string) {
  const normalized = stripDataUrlPrefix(dataBase64);
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

function guessExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'bin';
}

function downloadImage(image: NanobananaImage, index: number) {
  const blob = base64ToBlob(image.dataBase64, image.mimeType);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lateproof-${index + 1}.${guessExtension(image.mimeType)}`;
  link.click();
  URL.revokeObjectURL(url);
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-700">문제가 발생했어요</p>
      <p className="mt-2 text-red-600 text-sm">{error.message}</p>
      <Button className="mt-4" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}

function GenerateImageContent({
  error,
  onDownload,
  onDownloadAll,
  promptText,
  setPromptText,
  model,
  setModel,
  baseImageLabel,
  referenceImageLabel,
  onGenerate,
  status,
  images
}: {
  error: NanobananaError | null;
  onDownload: (image: NanobananaImage, index: number) => void;
  onDownloadAll: () => void;
  promptText: string;
  setPromptText: (value: string) => void;
  model: NanobananaModel;
  setModel: (value: NanobananaModel) => void;
  baseImageLabel: string;
  referenceImageLabel: string;
  onGenerate: () => void;
  status: ReturnType<typeof useGenerateImage>['status'];
  images: NanobananaImage[];
}) {
  if (error?.type === 'unknown') {
    throw new Error(error.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <PromptForm
        prompt={promptText}
        model={model}
        status={status}
        isLoading={status === 'loading'}
        baseImageLabel={baseImageLabel}
        referenceImageLabel={referenceImageLabel}
        onPromptChange={setPromptText}
        onModelChange={setModel}
        onSubmit={onGenerate}
      />

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm">
          <p className="font-semibold text-red-700">문제가 생겼어요</p>
          <p className="mt-1 text-red-600">{error.message}</p>
        </div>
      )}

      <ResultPreview
        images={images}
        status={status}
        onDownload={onDownload}
        onDownloadAll={onDownloadAll}
      />
    </div>
  );
}

type GenerateImageController = ReturnType<typeof useGenerateImage>;

interface GenerateImageViewProps {
  controller?: GenerateImageController;
}

export function GenerateImageView({ controller }: GenerateImageViewProps) {
  const persons = usePersonStore(selectPersons);
  const baseImageFile = usePhotoStore(selectPhotoFile);
  const fallbackController = useGenerateImage();
  const { status, images, error, generate, reset } = controller ?? fallbackController;

  const promptResult = useMemo(
    () => buildNanobananaPrompt({ persons, baseImageFile }),
    [persons, baseImageFile]
  );

  const [model, setModel] = useState<NanobananaModel>(NanobananaModelValues.PRO);
  const [promptText, setPromptText] = useState(() =>
    buildPromptText(promptResult.prompt, promptResult.negativePrompt)
  );

  const inputFiles = useMemo(
    () => toNanobananaInput(persons, baseImageFile),
    [persons, baseImageFile]
  );

  const baseImageLabel = inputFiles.baseImageFile
    ? `베이스 이미지: ${inputFiles.baseImageFile.name}`
    : '베이스 이미지: 없음';
  const referenceImageLabel = `참조 이미지: ${inputFiles.referenceImageFiles.length}장`;

  const handleGenerate = useCallback(() => {
    if (promptText.trim().length === 0) return;
    generate({
      model,
      prompt: promptText,
      baseImageFile: inputFiles.baseImageFile,
      referenceImageFiles: inputFiles.referenceImageFiles
    });
  }, [generate, inputFiles.baseImageFile, inputFiles.referenceImageFiles, model, promptText]);

  const handleDownload = useCallback((image: NanobananaImage, index: number) => {
    downloadImage(image, index);
  }, []);

  const handleDownloadAll = useCallback(() => {
    for (const [index, image] of images.entries()) {
      downloadImage(image, index);
    }
  }, [images]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset} resetKeys={[status]}>
      <GenerateImageContent
        error={error}
        onDownload={handleDownload}
        onDownloadAll={handleDownloadAll}
        promptText={promptText}
        setPromptText={setPromptText}
        model={model}
        setModel={setModel}
        baseImageLabel={baseImageLabel}
        referenceImageLabel={referenceImageLabel}
        onGenerate={handleGenerate}
        status={status}
        images={images}
      />
    </ErrorBoundary>
  );
}

/**
 * AI 이미지 생성용 데이터 내보내기 유틸리티
 *
 * @description
 * MATCH Step에서 설정한 모든 인물 배치 정보를 AI 이미지 생성 API로
 * 전달하기 위한 형식으로 변환합니다.
 */

import type { MatchStepDataForAI, Person, PersonForAI } from './types';

/** 마커 기본 크기 (픽셀) */
const MARKER_BASE_SIZE_PX = 60;
const DEFAULT_FACE_IMAGE_SCALE = 1.5;

function formatMarkerScaleLine(person: PersonForAI): string {
  if (person.scale === 1) {
    return `- 크기: 기본 크기 (${person.actualMarkerSizePx}px)`;
  }

  if (person.scale > 1) {
    return `- 크기: 기본 크기의 ${person.scale.toFixed(2)}배 (${Math.round(person.actualMarkerSizePx)}px)`;
  }

  return `- 크기: 기본 크기의 ${(person.scale * 100).toFixed(0)}% (${Math.round(person.actualMarkerSizePx)}px)`;
}

function formatRotationLine(person: PersonForAI): string {
  if (person.rotationDegrees === 0) {
    return '- 회전: 없음 (정방향)';
  }
  return `- 회전: 시계방향으로 ${Math.round(person.rotationDegrees)}도 회전`;
}

function formatFaceScaleLine(person: PersonForAI): string | null {
  if (Math.abs(person.faceImageScale - DEFAULT_FACE_IMAGE_SCALE) <= 0.01) {
    return null;
  }

  return `- 얼굴 크기: 마커 대비 ${(person.faceImageScale * 100).toFixed(0)}% (기본값 150%)`;
}

function formatFaceOffsetLine(person: PersonForAI): string {
  if (person.faceImageOffsetXPercent === 0 && person.faceImageOffsetYPercent === 0) {
    return '- 얼굴 조정: 중앙 정렬';
  }

  const xOffset = formatOffset(person.faceImageOffsetXPercent, '왼쪽', '오른쪽');
  const yOffset = formatOffset(person.faceImageOffsetYPercent, '위', '아래');
  const offsetParts = [xOffset, yOffset].filter(Boolean).join(', ');
  return `- 얼굴 조정: ${offsetParts || '없음'}`;
}

function formatFacePhotoLine(person: PersonForAI): string {
  if (person.hasFacePhoto) {
    return `- 얼굴 사진: 업로드됨 (${person.facePhotoFileName})`;
  }
  return '- 얼굴 사진: 미업로드';
}

/**
 * Person 데이터를 AI 전달용 형식으로 변환
 */
function convertPersonForAI(person: Person, index: number): PersonForAI {
  const actualMarkerSize = MARKER_BASE_SIZE_PX * person.transform.scale;

  return {
    // 기본 정보
    index: index + 1, // 1부터 시작
    id: person.id,

    // 위치 정보
    positionX: person.transform.x,
    positionY: person.transform.y,

    // 크기 정보
    scale: person.transform.scale,
    baseMarkerSizePx: MARKER_BASE_SIZE_PX,
    actualMarkerSizePx: actualMarkerSize,

    // 회전 정보
    rotationDegrees: person.transform.rotation,

    // 얼굴 이미지 오프셋
    faceImageScale: person.transform.imageScale,
    faceImageOffsetXPercent: person.transform.imageOffsetX,
    faceImageOffsetYPercent: person.transform.imageOffsetY,

    // 얼굴 사진 정보
    hasFacePhoto: person.facePhoto !== null,
    facePhotoFileName: person.facePhoto?.name ?? null,
    facePhotoFileSizeBytes: person.facePhoto?.size ?? null,
    facePhotoMimeType: person.facePhoto?.type ?? null
  };
}

/**
 * MATCH Step의 전체 데이터를 AI 전달용 형식으로 변환
 *
 * @param persons - 인물 목록
 * @param baseImageFile - 베이스 이미지 파일 (선택)
 * @returns AI 이미지 생성 API로 전달할 데이터
 *
 * @example
 * ```typescript
 * const persons = usePersonStore(selectPersons);
 * const baseImage = usePhotoStore(selectPhotoFile);
 * const dataForAI = exportMatchStepDataForAI(persons, baseImage);
 *
 * // API 호출
 * await generateImage(dataForAI);
 * ```
 */
export function exportMatchStepDataForAI(
  persons: Person[],
  baseImageFile?: File | null
): MatchStepDataForAI {
  const personsForAI = persons.map((person, index) => convertPersonForAI(person, index));
  const personsWithPhoto = persons.filter((p) => p.facePhoto !== null);

  return {
    stepName: 'MATCH',

    // 베이스 이미지 정보
    hasBaseImage: baseImageFile !== null && baseImageFile !== undefined,
    baseImageFileName: baseImageFile?.name ?? null,
    baseImageFileSizeBytes: baseImageFile?.size ?? null,
    baseImageMimeType: baseImageFile?.type ?? null,

    // 인물 정보
    totalPersonCount: persons.length,
    personsWithFacePhotoCount: personsWithPhoto.length,
    persons: personsForAI,

    // 메타 정보
    generatedAt: new Date().toISOString(),
    markerBaseSizePx: MARKER_BASE_SIZE_PX
  };
}

/**
 * MATCH Step 데이터를 사람이 읽기 쉬운 텍스트 형식으로 변환
 *
 * @description
 * AI 프롬프트에 포함하기 위한 텍스트 형식의 설명 생성.
 * 각 인물의 위치, 크기, 회전, 얼굴 위치 조정 정보를 상세히 기술합니다.
 *
 * @example
 * ```typescript
 * const dataForAI = exportMatchStepDataForAI(persons, baseImage);
 * const promptText = formatMatchStepDataAsPrompt(dataForAI);
 * console.log(promptText);
 * // 출력:
 * // [인물 배치 정보]
 * // 총 2명의 인물이 배치되어 있습니다.
 * //
 * // 인물 1:
 * // - 위치: 이미지의 좌측 20%, 하단 70% 지점
 * // - 크기: 기본 크기의 1.5배 (90px)
 * // - 회전: 시계방향으로 45도 회전
 * // - 얼굴 조정: 오른쪽으로 10%, 위로 5% 이동
 * // ...
 * ```
 */
export function formatMatchStepDataAsPrompt(data: MatchStepDataForAI): string {
  const lines: string[] = [];

  lines.push('[인물 배치 정보]');
  lines.push(`총 ${data.totalPersonCount}명의 인물이 배치되어 있습니다.`);

  if (data.personsWithFacePhotoCount < data.totalPersonCount) {
    lines.push(`(${data.personsWithFacePhotoCount}명만 얼굴 사진이 업로드됨)`);
  }

  lines.push('');

  for (const person of data.persons) {
    lines.push(`인물 ${person.index}:`);

    // 위치 설명
    const xPosition = formatPosition(person.positionX, '좌측', '우측');
    const yPosition = formatPosition(person.positionY, '상단', '하단');
    lines.push(`- 위치: 이미지의 ${xPosition}, ${yPosition} 지점`);

    // 크기 설명
    lines.push(formatMarkerScaleLine(person));

    // 회전 설명
    lines.push(formatRotationLine(person));

    // 얼굴 위치 조정 설명
    const faceScaleLine = formatFaceScaleLine(person);
    if (faceScaleLine) lines.push(faceScaleLine);
    lines.push(formatFaceOffsetLine(person));

    // 얼굴 사진 상태
    lines.push(formatFacePhotoLine(person));

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 위치 값 (0~1)을 사람이 읽을 수 있는 형식으로 변환
 */
function formatPosition(value: number, startLabel: string, endLabel: string): string {
  const percent = Math.round(value * 100);

  if (percent <= 25) {
    return `${startLabel} ${percent}%`;
  } else if (percent >= 75) {
    return `${endLabel} ${100 - percent}%에서`;
  } else if (percent >= 45 && percent <= 55) {
    return '중앙';
  } else if (percent < 50) {
    return `${startLabel} ${percent}%`;
  } else {
    return `${endLabel} ${100 - percent}%에서`;
  }
}

/**
 * 오프셋 값을 사람이 읽을 수 있는 형식으로 변환
 */
function formatOffset(value: number, negativeLabel: string, positiveLabel: string): string {
  if (value === 0) return '';

  const absValue = Math.abs(Math.round(value));
  if (value < 0) {
    return `${negativeLabel}으로 ${absValue}%`;
  } else {
    return `${positiveLabel}으로 ${absValue}%`;
  }
}

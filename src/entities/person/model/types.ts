/**
 * Person Entity Types — 사람 마커 관련 타입 정의
 *
 * @description
 * MATCH Step에서 사용하는 사람 마커 데이터 타입
 * - 위치, 스케일, 회전값은 정규화된 좌표(0~1)로 저장
 * - 색상은 고정 순서로 배정 (파란색 → 보라색 → 빨간색 → 노란색 → 초록색)
 */

/**
 * 사람 색상 타입
 */
export const PersonColor = {
  BLUE: 'BLUE',
  PURPLE: 'PURPLE',
  RED: 'RED',
  YELLOW: 'YELLOW',
  GREEN: 'GREEN'
} as const;

export type PersonColor = (typeof PersonColor)[keyof typeof PersonColor];

/**
 * 색상 순서 (고정)
 * 사람 추가 시 이 순서대로 사용되지 않은 첫 번째 색상을 할당
 */
export const PERSON_COLOR_ORDER: PersonColor[] = [
  PersonColor.BLUE,
  PersonColor.PURPLE,
  PersonColor.RED,
  PersonColor.YELLOW,
  PersonColor.GREEN
];

/**
 * 색상별 CSS 값 매핑
 */
export const PERSON_COLOR_VALUES: Record<
  PersonColor,
  { bg: string; border: string; text: string }
> = {
  [PersonColor.BLUE]: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-500'
  },
  [PersonColor.PURPLE]: {
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-500'
  },
  [PersonColor.RED]: {
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-500'
  },
  [PersonColor.YELLOW]: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-500'
  },
  [PersonColor.GREEN]: {
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-500'
  }
};

/**
 * 마커 변형 데이터 (정규화 좌표)
 */
export interface MarkerTransform {
  /** X 좌표 (0~1, 이미지 기준 - 0=좌측, 1=우측) */
  x: number;
  /** Y 좌표 (0~1, 이미지 기준 - 0=상단, 1=하단) */
  y: number;
  /** 스케일 (0.5~3.75, 1 = 기본 크기 60px) */
  scale: number;
  /** 회전 (도 단위, 0~360) */
  rotation: number;
  /** 얼굴 이미지 스케일 (1=100%, 1.5=150% - 마커 내부 이미지 크기 조절) */
  imageScale: number;
  /** 얼굴 이미지 X 오프셋 (-50 ~ 50, 퍼센트 - 마커 내 이미지 위치 조정) */
  imageOffsetX: number;
  /** 얼굴 이미지 Y 오프셋 (-50 ~ 50, 퍼센트 - 마커 내 이미지 위치 조정) */
  imageOffsetY: number;
}

/**
 * 표정 이모티콘 타입
 * EXPRESSION Step에서 선택 가능한 표정
 * emoji-picker-react를 사용하므로 모든 이모티콘 문자열 허용
 */
export type ExpressionEmoji = string;

/**
 * 빠른 선택용 표정 프리셋 (참고용)
 */
export const EXPRESSION_PRESETS = [
  '😄', // 기쁨
  '😢', // 슬픔
  '😡', // 화남
  '😮', // 놀람
  '😐', // 무표정
  '😴', // 졸림
  '🥰', // 사랑
  '😎', // 여유
  '🤔', // 생각
  '😏' // 음흉
] as const;

/**
 * 사람 데이터
 */
export interface Person {
  /** 고유 ID */
  id: string;
  /** 배정된 색상 (UI 구분용) */
  color: PersonColor;
  /** 얼굴 사진 파일 (업로드된 경우) */
  facePhoto: File | null;
  /** 얼굴 사진 미리보기 URL (blob URL) */
  facePhotoUrl: string | null;
  /** 마커 변형 데이터 */
  transform: MarkerTransform;
  /** 선택된 표정 이모티콘 (EXPRESSION Step에서 선택, optional) */
  expression: ExpressionEmoji | null;
}

/**
 * Person Store 상태
 */
export interface PersonState {
  /** 사람 목록 */
  persons: Person[];
  /** 현재 선택된(Active) 사람 ID */
  activePersonId: string | null;
  /** MATCH Step 초기화 완료 여부 (최초 1회만 초기화) */
  initialized: boolean;
}

// =============================================================================
// AI 이미지 생성용 타입 정의
// =============================================================================

/**
 * AI 이미지 생성 API로 전달할 인물 데이터
 *
 * @description
 * MATCH Step에서 설정한 모든 정보를 AI에게 상세히 전달하기 위한 타입.
 * 이미지 파일은 base64로 인코딩하거나 별도 업로드 후 URL로 전달.
 */
export interface PersonForAI {
  /** 인물 순서 번호 (1부터 시작) */
  index: number;
  /** 고유 식별자 */
  id: string;

  // ===== 위치 정보 (베이스 이미지 기준) =====
  /** 마커 중심 X 좌표 (0~1, 0=좌측 끝, 0.5=중앙, 1=우측 끝) */
  positionX: number;
  /** 마커 중심 Y 좌표 (0~1, 0=상단 끝, 0.5=중앙, 1=하단 끝) */
  positionY: number;

  // ===== 크기 정보 =====
  /** 마커 스케일 배율 (0.5=절반 크기, 1=기본 크기, 2=2배 크기) */
  scale: number;
  /** 기본 마커 크기 (픽셀 기준, 60px) */
  baseMarkerSizePx: number;
  /** 실제 마커 크기 (scale 적용 후, 픽셀 단위) */
  actualMarkerSizePx: number;

  // ===== 회전 정보 =====
  /** 회전 각도 (0~360도, 시계방향) */
  rotationDegrees: number;

  // ===== 얼굴 이미지 내부 오프셋 =====
  /** 마커 내 얼굴 이미지 스케일 (1=100%, 1.5=150%) */
  faceImageScale: number;
  /** 마커 내 얼굴 이미지 X 오프셋 (-50~50%, 음수=왼쪽으로 이동, 양수=오른쪽으로 이동) */
  faceImageOffsetXPercent: number;
  /** 마커 내 얼굴 이미지 Y 오프셋 (-50~50%, 음수=위로 이동, 양수=아래로 이동) */
  faceImageOffsetYPercent: number;

  // ===== 얼굴 사진 정보 =====
  /** 얼굴 사진 존재 여부 */
  hasFacePhoto: boolean;
  /** 얼굴 사진 파일명 (있는 경우) */
  facePhotoFileName: string | null;
  /** 얼굴 사진 파일 크기 (bytes, 있는 경우) */
  facePhotoFileSizeBytes: number | null;
  /** 얼굴 사진 MIME 타입 (있는 경우) */
  facePhotoMimeType: string | null;
}

/**
 * MATCH Step 전체 데이터 (AI 이미지 생성용)
 *
 * @description
 * MATCH Step에서의 모든 설정 정보를 AI 이미지 생성 API로 전달하기 위한 종합 데이터 타입.
 * 베이스 이미지 정보와 각 인물의 상세 배치 정보를 포함.
 */
export interface MatchStepDataForAI {
  /** Step 이름 */
  stepName: 'MATCH';

  // ===== 베이스 이미지 정보 =====
  /** 베이스 이미지 존재 여부 */
  hasBaseImage: boolean;
  /** 베이스 이미지 파일명 (있는 경우) */
  baseImageFileName: string | null;
  /** 베이스 이미지 파일 크기 (bytes, 있는 경우) */
  baseImageFileSizeBytes: number | null;
  /** 베이스 이미지 MIME 타입 (있는 경우) */
  baseImageMimeType: string | null;

  // ===== 인물 배치 정보 =====
  /** 총 인물 수 */
  totalPersonCount: number;
  /** 얼굴 사진이 업로드된 인물 수 */
  personsWithFacePhotoCount: number;
  /** 인물별 상세 데이터 */
  persons: PersonForAI[];

  // ===== 메타 정보 =====
  /** 데이터 생성 시각 (ISO 8601) */
  generatedAt: string;
  /** 마커 기본 크기 (픽셀) */
  markerBaseSizePx: number;
}

# LateProof — Architecture Documentation

> **목적**: 프로젝트 폴더 구조와 아키텍처 패턴 정의  
> **갱신 방식**: 기능 개발 완료 시마다 업데이트  
> **Last Updated**: 2025-12-23 (Nanobanana 생성/다운로드 플로우 초기 구축)

---

## 2025-12-23 업데이트
- 추가: `app/api/nanobanana/_lib/adapter.ts` — Gemini 요청/응답 어댑터
- 추가: `app/api/nanobanana/generate/route.ts` — Gemini generateContent 프록시
- 추가: `app/api/nanobanana/download/route.ts` — base64 다운로드 응답
- 추가: `src/entities/person/model/to-nanobanana-input.ts` — 인물/베이스 이미지 입력 변환
- 추가: `src/entities/person/model/to-nanobanana-input.test.ts` — 입력 변환 유닛 테스트
- 추가: `src/features/generate-image/` — 생성 폼/프리뷰/훅/테스트/스토리
- 추가: `src/pages/generate-image/` — GENERATE Step 페이지
- 추가: `mocks/handlers/gemini-nanobanana.ts` — Gemini generateContent MSW 핸들러
- 변경: `src/shared/api/nanobanana` → `src/features/generate-image/api` — Nanobanana 타입 위치 이동
- 변경: `src/app/router/step-router.tsx` — GENERATE 페이지 연결 + 결제 스텁 버튼 추가
- 변경: `mocks/handlers/index.ts` — Gemini 핸들러 등록
- 변경: `package.json` — `react-error-boundary` 의존성 추가

## 2025-12-18 업데이트
- 추가: `emoji-picker-react` 패키지 — 이모티콘 선택 UI
- 변경: `src/entities/person/model/types.ts` — `ExpressionEmoji` 타입을 string으로 확장, `EXPRESSION_PRESETS` 추가
- 변경: `src/entities/person/model/store.ts` — `setExpression`, `clearExpression` 액션 추가
- 추가: `src/entities/person/model/nanobanana-prompt.ts` — Nanobanana 최종 프롬프트/디버그 요약 생성 유틸
- 추가: `src/entities/person/model/nanobanana-prompt.test.ts` — 프롬프트 빌더 유닛 테스트
- 추가: `src/features/expression-select/ui/expression-person-button.tsx` — 인물 선택 버튼 컴포넌트
- 추가: `src/features/expression-select/ui/expression-grid.tsx` — emoji-picker-react 기반 표정 선택 UI
- 변경: `src/features/expression-select/ui/expression-select-view.tsx` — 결제하기 클릭 시 프롬프트 콘솔 출력 + Step 이동
- 변경: `src/features/expression-select/ui/expression-select-view.test.tsx` — 결제하기 클릭 시 콘솔 출력 스파이 추가
- 추가: 각 컴포넌트별 테스트 및 스토리 파일
- 변경: `prompt/nanobanana.md` — 베이스 이미지 보존(크롭/리사이즈/인물 삭제 금지) + 프레임/라운드 코너/face swap 억제 규칙 강화

---

## 2025-12-17 업데이트
- 변경: `app/layout.tsx` — Sonner `Toaster` 추가(전역 토스트 렌더링)
- 변경: `src/features/match-photo/ui/match-photo-view.tsx` — 검증 실패 메시지 `window.alert` → `toast.error`
- 변경: `package.json` — `sonner` 의존성 추가
- 변경: `src/features/match-photo/ui/match-photo-view.test.tsx` — 검증 실패 시 토스트 호출 테스트 추가
- 추가: `app/api/face/validate/route.test.ts` — MSW로 Azure Face 호출을 모킹하여 Route Handler를 단위 테스트
- 추가: `mocks/handlers/azure-face.ts` — Azure Face `/face/v1.0/detect` 모킹(요청 바디로 케이스 분기)
- 변경: `mocks/handlers/index.ts` — Azure Face 핸들러를 wildcard 기반으로 교체
- 변경: `vitest.setup.ts` — unhandled 외부 요청을 `error`로 처리(외부 API 실호출 방지)
- 추가: `app/api/face/validate/route.ts` — Azure Face API(/face/v1.0/detect) 프록시 + 얼굴/저해상도 검증
- 추가: `src/features/match-photo/model/validate-face-photo.ts` — 프론트에서 검증 API 호출(FormData)
- 추가: `src/features/match-photo/model/validate-face-photo.test.ts` — 검증 API 호출 유틸 유닛 테스트
- 변경: `src/features/match-photo/ui/match-photo-view.tsx` — 업로드/교체 시 검증 성공 시에만 얼굴 사진 저장
- 변경: `.env.example` — `AZURE_FACE_ENDPOINT`, `AZURE_FACE_KEY` 추가
- 변경: `src/entities/person/model/types.ts` — `MarkerTransform.imageScale`(얼굴 이미지 크기) 추가, `PersonForAI.faceImageScale` 반영
- 변경: `src/entities/person/model/store.ts` — 인물 추가 시 Active 마커 기준으로 "반쯤 겹치게" 우측 스택 배치
- 변경: `src/features/match-photo/ui/person-marker.tsx` — 마커 내부 얼굴 이미지 +/- 크기 조절 컨트롤 추가
- 변경: `src/entities/person/model/export-for-ai.ts` — AI 전달 데이터에 얼굴 이미지 스케일 포함 및 프롬프트 출력 개선

## 📁 Project Structure

```
lateproof/
├── .ruler/                    # 프로젝트 문서화 (PRD, SG, TASKS, PLAN, AGENTS)
│   ├── AGENTS.md             # AI Agent 지침
│   ├── ARCHITECTURE.md       # 아키텍처 문서 (본 파일)
│   ├── PlAN.md               # 구현 계획 및 진행 상황
│   ├── PRD.md                # Product Requirements Document
│   ├── SG.md                 # Style Guide
│   ├── TASKS.md              # Task 관리
│   └── ruler.toml            # Ruler 설정
│
├── .storybook/               # Storybook 설정
│   ├── main.ts               # Storybook 메인 설정
│   └── preview.ts            # 글로벌 데코레이터 및 파라미터
│
├── .vscode/                  # VSCode 설정
│   └── settings.json         # 워크스페이스 설정
│
├── app/                      # Next.js App Router (루트 레이아웃, 페이지)
│   ├── app/                  # "/app" 메인 애플리케이션 라우트
│   │   └── page.tsx          # StepRouter 렌더링
│   ├── api/                  # Next.js Route Handlers (서버 전용 API)
│   │   ├── face/
│   │   │   └── validate/
│   │   │       └── route.ts   # Azure Face 기반 얼굴 검증 API
│   │   └── nanobanana/
│   │       ├── _lib/
│   │       │   └── adapter.ts # Gemini 요청/응답 변환 어댑터
│   │       ├── download/
│   │       │   └── route.ts   # base64 다운로드 응답
│   │       └── generate/
│   │           └── route.ts   # Gemini generateContent 프록시
│   ├── globals.css           # 전역 스타일 (Tailwind CSS)
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # "/" 루트 페이지 (랜딩페이지 예정, 현재 /app 리다이렉트)
│
├── e2e/                      # Playwright E2E 테스트
│   ├── example.spec.ts       # 예제 E2E 테스트
│   └── README.md             # E2E 테스트 가이드
│
├── mocks/                    # MSW (Mock Service Worker)
│   ├── handlers/             # API Mock 핸들러
│   │   ├── azure-face.ts     # Azure Face API 핸들러
│   │   ├── gemini-nanobanana.ts # Gemini generateContent 핸들러
│   │   └── index.ts          # 핸들러 정의
│   ├── browser.ts            # 브라우저 환경 MSW 설정
│   ├── node.ts               # Node 환경 MSW 설정
│   └── README.md             # MSW 사용 가이드
│
├── pages/                    # 기타 페이지 (필요시 사용)
│   └── README.md
│
├── public/                   # 정적 파일 (이미지, 폰트 등)
│   └── README.md
│
├── src/                      # 소스 코드 (FSD 아키텍처)
│   ├── app/                  # App Layer (앱 초기화, 프로바이더, 라우팅)
│   │   ├── router/           # Step 기반 라우터 (Segment)
│   │   │   ├── step-router.tsx
│   │   │   └── index.ts      # Public API
│   │   └── README.md
│   │
│   ├── entities/             # Entities Layer (비즈니스 엔티티, 읽기 전용)
│   │   ├── photo/            # Photo 엔티티 (선택된 파일 상태)
│   │   │   ├── model/
│   │   │   │   ├── store.ts
│   │   │   │   ├── store.test.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── step/             # Step 엔티티 (워크플로우 상태 관리)
│   │   │   ├── model/        # 도메인 모델
│   │   │   │   ├── step.ts   # Step as const, STEP_META, STEP_ORDER
│   │   │   │   ├── transition.ts  # FSM Transition Table
│   │   │   │   ├── types.ts  # Mode, StepState, StepTransitionContext
│   │   │   │   ├── store.ts  # Step FSM Store (Zustand)
│   │   │   │   ├── store.test.ts  # Store Unit Test (17 tests)
│   │   │   │   └── index.ts  # model Public API
│   │   │   └── index.ts      # entity Public API
│   │   ├── person/           # Person 엔티티 (인물 마커 상태 관리) - Epic 2.4
│   │   │   ├── model/
│   │   │   │   ├── types.ts      # PersonColor, MarkerTransform, Person, PersonState
│   │   │   │   ├── export-for-ai.ts   # MATCH Step AI 전달용 변환 유틸
│   │   │   │   ├── export-for-ai.test.ts
│   │   │   │   ├── nanobanana-prompt.ts   # Nanobanana 최종 프롬프트 생성 유틸
│   │   │   │   ├── nanobanana-prompt.test.ts
│   │   │   │   ├── to-nanobanana-input.ts # Person → Nanobanana 입력 변환
│   │   │   │   ├── to-nanobanana-input.test.ts
│   │   │   │   ├── store.ts      # Person Store (Zustand) - 최대 5명, 초기화/재초기화
│   │   │   │   ├── store.test.ts
│   │   │   │   └── index.ts      # model Public API
│   │   │   └── index.ts          # entity Public API
│   │   └── README.md
│   │
│   ├── features/             # Features Layer (비즈니스 기능, 쓰기 작업)
│   │   ├── select-mode/      # 모드 선택 기능
│   │   │   ├── ui/           # UI 컴포넌트
│   │   │   │   ├── mode-card.tsx
│   │   │   │   ├── mode-card.test.tsx (7 tests)
│   │   │   │   ├── mode-card.stories.tsx
│   │   │   │   └── select-mode-view.tsx
│   │   │   └── index.ts
│   │   ├── upload-photo/     # 사진 업로드 기능
│   │   │   ├── ui/
│   │   │   │   ├── upload-dropzone.tsx
│   │   │   │   └── upload-photo-view.tsx
│   │   │   └── index.ts
│   │   ├── match-photo/      # 인물 마커 배치 기능 (Epic 2.4)
│   │   │   ├── model/
│   │   │   │   ├── validate-face-photo.ts
│   │   │   │   └── validate-face-photo.test.ts
│   │   │   ├── ui/
│   │   │   │   ├── person-marker.tsx      # 이미지 위 마커 컴포넌트
│   │   │   │   ├── person-marker.test.tsx
│   │   │   │   ├── person-marker.stories.tsx
│   │   │   │   ├── person-button.tsx      # 하단 사람 버튼
│   │   │   │   ├── person-button.test.tsx
│   │   │   │   ├── person-button.stories.tsx
│   │   │   │   ├── add-person-button.tsx  # 사람 추가 버튼
│   │   │   │   ├── add-person-button.test.tsx
│   │   │   │   ├── add-person-button.stories.tsx
│   │   │   │   ├── person-list-panel.tsx  # 하단 사람 목록 패널
│   │   │   │   ├── person-list-panel.test.tsx
│   │   │   │   ├── person-list-panel.stories.tsx
│   │   │   │   ├── image-canvas.tsx       # 베이스 이미지 + 마커 오버레이
│   │   │   │   ├── image-canvas.test.tsx
│   │   │   │   ├── image-canvas.stories.tsx
│   │   │   │   ├── match-photo-view.tsx   # 매칭 메인 뷰
│   │   │   │   ├── match-photo-view.test.tsx
│   │   │   │   └── match-photo-view.stories.tsx
│   │   │   └── index.ts
│   │   ├── expression-select/ # 표정 선택 기능 (Epic 2.5)
│   │   │   ├── ui/
│   │   │   │   ├── expression-select-view.tsx
│   │   │   │   ├── expression-select-view.test.tsx
│   │   │   │   └── expression-select-view.stories.tsx
│   │   │   └── index.ts
│   │   ├── generate-image/   # 이미지 생성 기능 (Epic 2.8)
│   │   │   ├── api/
│   │   │   │   ├── nanobanana-client.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   ├── model/
│   │   │   │   ├── use-generate-image.ts
│   │   │   │   └── use-generate-image.test.ts
│   │   │   ├── ui/
│   │   │   │   ├── prompt-form.tsx
│   │   │   │   ├── prompt-form.test.tsx
│   │   │   │   ├── prompt-form.stories.tsx
│   │   │   │   ├── result-preview.tsx
│   │   │   │   ├── result-preview.test.tsx
│   │   │   │   ├── result-preview.stories.tsx
│   │   │   │   ├── generate-image-view.tsx
│   │   │   │   ├── generate-image-view.test.tsx
│   │   │   │   └── generate-image-view.stories.tsx
│   │   │   └── index.ts
│   │   └── README.md
│   │
│   ├── pages/                # Pages Layer (페이지 조합)
│   │   ├── select-mode/      # 모드 선택 페이지
│   │   │   ├── ui/
│   │   │   │   └── select-mode-page.tsx
│   │   │   └── index.ts
│   │   ├── upload-photo/     # 사진 업로드 페이지
│   │   │   ├── ui/
│   │   │   │   └── upload-photo-page.tsx
│   │   │   └── index.ts
│   │   ├── match-photo/      # 인물 매칭 페이지 (Epic 2.4)
│   │   │   ├── ui/
│   │   │   │   ├── match-photo-page.tsx
│   │   │   │   ├── match-photo-page.test.tsx
│   │   │   │   └── match-photo-page.stories.tsx
│   │   │   └── index.ts
│   │   ├── expression-select/ # 표정 선택 페이지 (Epic 2.5)
│   │   │   ├── ui/
│   │   │   │   ├── expression-select-page.tsx
│   │   │   │   ├── expression-select-page.test.tsx
│   │   │   │   └── expression-select-page.stories.tsx
│   │   │   └── index.ts
│   │   ├── generate-image/   # 이미지 생성 페이지 (Epic 2.8)
│   │   │   ├── ui/
│   │   │   │   ├── generate-image-page.tsx
│   │   │   │   ├── generate-image-page.test.tsx
│   │   │   │   └── generate-image-page.stories.tsx
│   │   │   └── index.ts
│   │   └── README.md
│   │
│   ├── shared/               # Shared Layer (공통 코드)
│   │   ├── components/       # 공통 UI 컴포넌트
│   │   │   └── ui/           # Shadcn/UI 기반 컴포넌트
│   │   │       ├── button.tsx
│   │   │       ├── button.test.tsx
│   │   │       ├── button.stories.tsx
│   │   │       ├── next-step-button.tsx
│   │   │       ├── next-step-button.test.tsx
│   │   │       └── next-step-button.stories.tsx
│   │   └── lib/              # 공통 유틸리티
│   │       ├── utils.ts      # cn() 등 유틸 함수
│   │       ├── index.ts
│   │       └── example.test.ts
│   │
│   └── widgets/              # Widgets Layer (복합 UI 블록)
│       ├── step-header/      # Step 공통 헤더 위젯
│       │   ├── ui/
│       │   │   ├── step-header.tsx
│       │   │   ├── step-header.test.tsx
│       │   │   └── step-header.stories.tsx
│       │   └── index.ts
│       └── README.md
│
├── .env.example              # 환경 변수 템플릿
├── .gitignore                # Git 제외 파일
├── biome.json                # Biome 설정 (Lint/Format)
├── components.json           # Shadcn/UI 설정
├── lefthook.yml              # Git Hooks 설정
├── next.config.ts            # Next.js 설정
├── package.json              # 패키지 의존성
├── playwright.config.ts      # Playwright 설정
├── postcss.config.mjs        # PostCSS 설정
├── README.md                 # 프로젝트 README
├── tsconfig.json             # TypeScript 설정
├── vitest.config.ts          # Vitest 설정
└── vitest.setup.ts           # Vitest Setup 파일
```

---

## 🏗️ Architecture Patterns

### FSD (Feature-Sliced Design)

프로젝트는 **FSD 아키텍처**를 따른다. FSD는 계층형 구조로 비즈니스 로직을 분리하며, `processes` Layer는 제거되었다.

#### FSD 구조 규칙

**일반 Layer** (pages, widgets, features, entities):
```
Layer → Slice → Segment
예: entities/user/model
    features/auth/ui
    pages/home/ui
```

**특수 Layer** (app, shared):
```
Layer → Segment (Slice 없음)
예: app/router
    app/providers
    shared/ui
    shared/lib
```

**중요**: `app`과 `shared` Layer는 **Slices 없이 바로 Segments**로 구성된다.

#### Layer 정의

| Layer | 역할 | 의존성 방향 |
|-------|-----|-----------|
| **app** | 앱 초기화, 프로바이더, 라우팅 설정 | → pages, features, entities, shared |
| **pages** | 페이지 단위 조합 | → features, entities, widgets, shared |
| **widgets** | 복합 UI 블록 (헤더, 푸터 등) | → features, entities, shared |
| **features** | 비즈니스 기능 (쓰기 작업, Server Actions) | → entities, shared |
| **entities** | 비즈니스 엔티티 (읽기 작업, 순수 UI) | → shared |
| **shared** | 공통 코드 (UI 컴포넌트, 유틸, 훅) | 없음 (최하위) |

#### 의존성 규칙

- **상위 Layer는 하위 Layer만 참조 가능**
- **같은 Layer 간 참조 금지**
- **하위 Layer는 상위 Layer를 절대 참조 불가**

```
app → pages → widgets → features → entities → shared
                    ↘            ↗
```

---

## 📂 Directory Details

### `.ruler/` — 프로젝트 문서화

프로젝트의 모든 문서를 중앙 관리한다. AI Agent가 참조하는 핵심 문서.

- `PRD.md`: 제품 요구사항 정의
- `SG.md`: 스타일 가이드 (색상, 타이포그래피, Stealth UX)
- `TASKS.md`: Milestone/Epic/Task 관리
- `PlAN.md`: 구현 계획 및 진행 상황
- `AGENTS.md`: AI Agent 지침
- `ARCHITECTURE.md`: 아키텍처 문서 (본 파일)
- `ruler.toml`: Ruler 도구 설정

---

### `app/` — Next.js App Router

Next.js 15 App Router의 루트 레이아웃과 페이지.

**라우팅 구조**:
- `/` (루트): `app/page.tsx` — 랜딩페이지 (다음 커밋, 현재는 /app 리다이렉트)
- `/app`: `app/app/page.tsx` — 메인 애플리케이션 (StepRouter 렌더링)

**파일 역할**:
- `layout.tsx`: 전역 레이아웃 (메타데이터, 폰트, 프로바이더)
- `page.tsx`: 루트 페이지 (`/`)
- `app/page.tsx`: 메인 애플리케이션 페이지 (`/app`)
- `globals.css`: Tailwind CSS 전역 스타일
- `api/face/validate/route.ts`: Azure Face 프록시 API
- `api/nanobanana/generate/route.ts`: Gemini generateContent 프록시
- `api/nanobanana/download/route.ts`: base64 다운로드 응답

---

### `src/app/` — App Layer (FSD)

앱 초기화, 전역 프로바이더, 라우팅 설정.

**현재 구조** (FSD 규칙 준수):
```
src/app/
├── router/             # Segment: Step 기반 라우터
│   ├── step-router.tsx # FSM 기반 페이지 라우팅
│   └── index.ts        # Public API
└── README.md
```

**예정된 확장**:
```
src/app/
├── router/             # Segment: Step 기반 라우터
│   ├── step-router.tsx
│   └── index.ts
├── providers/          # Segment: React Query Provider (예정)
│   ├── query-provider.tsx
│   └── index.ts
└── README.md
```

**FSD 구조 규칙**: `app` Layer는 Slices 없이 바로 Segments로 구성 (router, providers 등)

**역할**:
- **Step 기반 라우팅**: `router/step-router.tsx`가 여러 Pages를 조합하여 애플리케이션 흐름 제어
- 전역 프로바이더 설정 (React Query, Theme 등)
- 앱 레벨 라우팅 및 레이아웃 구성
- **엔티티별 Store는 각 entities에 포함** (예: Step Store → entities/step/model/store.ts)

**의존성 흐름**:
```
app/app/page.tsx (Next.js App Router)
  ↓
src/app/router/step-router.tsx (App Layer)
  ↓
src/pages/select-mode/ (Pages Layer)
src/pages/upload-photo/
src/pages/match-photo/
src/pages/expression-select/
src/pages/generate-image/
...
```

**Public API 노출**:
```typescript
// src/app/router/index.ts
export { StepRouter } from './step-router';

// app/app/page.tsx에서 사용
import { StepRouter } from '@/app/router';
```

---

### `src/entities/` — Entities Layer (FSD)

비즈니스 엔티티 정의. **읽기 전용 작업 (GET)** 중심.

**현재 구조**:
```
src/entities/
├── photo/              # Photo 엔티티 (선택된 파일 상태)
│   ├── model/
│   │   ├── store.ts        # Photo Store (Zustand)
│   │   ├── store.test.ts   # Store Unit Test
│   │   └── index.ts        # model Public API
│   └── index.ts            # entity Public API
├── step/               # Step 엔티티 (워크플로우 FSM)
│   ├── model/
│   │   ├── step.ts     # Step as const 패턴, STEP_META, STEP_ORDER
│   │   ├── transition.ts  # TRANSITION_TABLE, canTransition, validateTransition
│   │   ├── types.ts    # Mode, StepState, StepTransitionContext
│   │   ├── store.ts    # Step FSM Store (Zustand)
│   │   ├── store.test.ts  # Store Unit Test (17 tests)
│   │   └── index.ts    # model Public API
│   └── index.ts        # entity Public API
└── README.md
```

**Photo Entity 상세**:
- **store.ts** (Zustand Photo Store):
  - `usePhotoStore`: 선택된 `File`을 Step 간 유지하기 위한 Store
  - `setFile()`: 선택 파일 저장
  - `clear()`: 초기화
  - Selectors: `selectPhotoFile`

**Step Entity 상세**:
- **step.ts**: 
  - `Step` (as const 패턴): `SELECT_MODE`, `UPLOAD`, `MATCH`, `EXPRESSION`, `PAYMENT`, `GENERATE`, `RESULT`
  - `STEP_META`: 각 Step의 한글 라벨, 진행률(0~100), 뒤로가기 가능 여부
  - `STEP_ORDER`: Step 순서 배열
- **transition.ts**:
  - `TRANSITION_TABLE`: FSM 기반 Step 전환 규칙 정의
  - `canTransition()`: Step 전환 가능 여부 확인
  - `validateTransition()`: 전환 검증 (실패 시 `TransitionError`)
  - `getNextSteps()`: 현재 Step에서 이동 가능한 Step 목록 조회
- **types.ts**:
  - `Mode`: `PHOTO` | `MAP` (모드 선택)
  - `StepState`: 현재 Step, 선택 모드, 전환 히스토리
  - `StepTransitionContext`: Step 전환 컨텍스트 (from, to, timestamp, reason)
- **store.ts** (Zustand FSM Store):
  - `useStepStore`: Zustand FSM Store (devtools 포함)
  - `setMode()`: 모드 선택 (PHOTO | MAP)
  - `nextStep()`: Transition Table 검증 후 Step 전환
  - `prevStep()`: 히스토리 기반 이전 Step 복원
  - `reset()`: Store 초기화
  - Selectors: `selectCurrentStep`, `selectMode`, `selectHistory`, `selectCanGoBack`
- **store.test.ts**: 17개 Unit Test (Selector 테스트 포함, 모든 테스트 통과)

**예정된 추가 Entity**:
```
src/entities/
├── image/              # 이미지 엔티티 (예정)
│   ├── model/          # 타입 정의
│   └── ui/             # 이미지 뷰어 컴포넌트
└── payment/            # 결제 엔티티 (예정)
    └── model/          # 결제 상태 타입
```

**Person Entity 상세 (Epic 2.4 신규)**:
- **types.ts**:
  - `PersonColor`: 5가지 고정 색상 (BLUE, PURPLE, RED, YELLOW, GREEN)
  - `PERSON_COLOR_ORDER`: 색상 배정 순서
  - `PERSON_COLOR_VALUES`: CSS 클래스 매핑
  - `MarkerTransform`: 정규화 좌표(0~1), 스케일, 회전값
  - `Person`: 사람 데이터 (id, color, facePhoto, transform)
  - `PersonState`: Store 상태 (persons, activePersonId, initialized)
- **store.ts** (Zustand Person Store):
  - `usePersonStore`: 인물 마커 상태 관리
  - `initialize()`: MATCH 최초 진입 시 초기화 (EXPRESSION에서 돌아올 때 스킵)
  - `reinitialize()`: 초기화 버튼용 강제 재초기화
  - `addPerson()`: 사람 추가 (최대 5명, 고정 색상 순서)
  - `removePerson()`: 사람 삭제 (최소 1명 유지)
  - `setActivePerson()`: Active 사람 변경
  - `setFacePhoto()`: 얼굴 사진 업로드
  - `updateTransform()`: 마커 위치/스케일/회전 업데이트
  - Selectors: `selectPersons`, `selectActivePersonId`, `selectCanAddPerson` 등
- **nanobanana-prompt.ts**:
  - `buildNanobananaPrompt()`: 인물 배치 + 표정 정보 기반 프롬프트 생성
- **to-nanobanana-input.ts**:
  - `toNanobananaInput()`: 베이스/참조 이미지 입력 파일로 변환

---

### `src/features/` — Features Layer (FSD)

비즈니스 기능 구현. **쓰기 작업 (POST/PUT/DELETE, Server Actions)** 중심.

**현재 구조**:
```
src/features/
├── select-mode/        # 모드 선택 기능 (Epic 2.2 완료)
│   ├── ui/
│   │   ├── mode-card.tsx           # Photo/Map 선택 카드
│   │   ├── mode-card.test.tsx      # 7 unit tests
│   │   ├── mode-card.stories.tsx   # 4 Storybook stories
│   │   ├── select-mode-view.tsx    # 모드 선택 뷰(Presentational)
│   │   ├── select-mode-view.test.tsx
│   │   └── select-mode-view.stories.tsx
│   └── index.ts
├── upload-photo/       # 사진 업로드 기능 (Epic 2.3 완료)
│   ├── ui/
│   │   ├── upload-dropzone.tsx
│   │   └── upload-photo-view.tsx
│   └── index.ts
├── match-photo/        # 인물 마커 배치 기능 (Epic 2.4 완료)
│   ├── model/
│   │   ├── validate-face-photo.ts
│   │   └── validate-face-photo.test.ts
│   ├── ui/             # person-marker/person-list-panel 등
│   └── index.ts
├── expression-select/  # 표정 선택 기능 (Epic 2.5 완료)
│   ├── ui/
│   │   ├── expression-select-view.tsx
│   │   └── expression-select-view.stories.tsx
│   └── index.ts
├── generate-image/     # 이미지 생성 기능 (Epic 2.8 진행 중)
│   ├── api/
│   │   ├── nanobanana-client.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── model/
│   │   ├── use-generate-image.ts
│   │   └── use-generate-image.test.ts
│   ├── ui/             # prompt-form/result-preview/generate-image-view
│   └── index.ts
└── README.md
```

**select-mode Feature 상세**:
- **mode-card.tsx**:
  - Photo/Map 모드 선택 카드 컴포넌트
  - Framer Motion 애니메이션 (whileHover, whileTap)
  - 브랜드 Purple 색상 시스템
  - Stealth UX 준수 (자연스러운 언어)
  - Props: icon, title, description, badge, onClick, isSelected
- **select-mode-view.tsx**:
  - 모드 선택 화면 전체 UI
  - props 기반(Presentational)으로 렌더링만 수행
  - 선택 이벤트만 외부로 방출 (`setSelectedMode`)

**Features Layer 판단 기준**:

Features Layer는 다음 조건을 만족해야 한다:
1. **사용자 의도 존재**: 선택, 등록, 수정, 삭제 등의 비즈니스 시나리오
2. **쓰기 작업 수행**: POST/PUT/DELETE, Server Actions, Store 상태 변경
3. **비즈니스 로직 포함**: 단순 표시가 아닌 실제 기능 구현

**예시**:
```typescript
// ✅ features/select-mode (현재 구조)
// - 사용자 의도: Photo/Map 모드 선택
// - 쓰기 작업: setMode(), nextStep()
// - 비즈니스 로직: 모드 선택 → 검증 → Store 업데이트 → Step 전환

export function SelectModeView() {
  const { setMode, nextStep } = useStepStore();
  
  const handleNext = () => {
    setMode(selectedMode);  // ← 쓰기
    nextStep();             // ← 쓰기
  };
}

// ❌ entities — 읽기만 수행
export function ModeDisplay() {
  const mode = useStepStore(selectMode);  // ← 읽기만
  return <div>{mode}</div>;
}

// ❌ widgets — 여러 features/entities 조합
export function Header() {
  return (
    <header>
      <StepIndicator />  // ← 조합
      <UserMenu />       // ← 조합
    </header>
  );
}
```

**예정된 추가 Feature**:
```
src/features/
└── process-payment/    # 결제 처리 기능 (예정)
    └── api/            # Toss Payments 연동
```

---

### `src/pages/` — Pages Layer (FSD)

페이지 단위 조합. Features와 Entities를 조합하여 완전한 페이지 구성.

**현재 구조**:
```
src/pages/
├── select-mode/        # 모드 선택 페이지 (Epic 2.2 완료)
│   ├── ui/
│   │   ├── select-mode-page.tsx
│   │   ├── select-mode-page.test.tsx
│   │   └── select-mode-page.stories.tsx
│   └── index.ts
├── upload-photo/       # 사진 업로드 페이지 (Epic 2.3 완료)
│   ├── ui/
│   │   ├── upload-photo-page.tsx
│   │   ├── upload-photo-page.test.tsx
│   │   └── upload-photo-page.stories.tsx
│   └── index.ts
├── match-photo/        # 인물 매칭 페이지 (Epic 2.4 완료)
│   ├── ui/
│   │   ├── match-photo-page.tsx
│   │   ├── match-photo-page.test.tsx
│   │   └── match-photo-page.stories.tsx
│   └── index.ts
├── expression-select/  # 표정 선택 페이지 (Epic 2.5 완료)
│   ├── ui/
│   │   ├── expression-select-page.tsx
│   │   ├── expression-select-page.test.tsx
│   │   └── expression-select-page.stories.tsx
│   └── index.ts
├── generate-image/     # 이미지 생성 페이지 (Epic 2.8 진행 중)
│   ├── ui/
│   │   ├── generate-image-page.tsx
│   │   ├── generate-image-page.test.tsx
│   │   └── generate-image-page.stories.tsx
│   └── index.ts
└── README.md
```

**select-mode Page 상세**:
- **select-mode-page.tsx**:
  - SelectModeView feature를 조합한 완전한 페이지
  - FSD Pages Layer 역할 수행
  - app/page.tsx에서 StepRouter를 통해 렌더링

**예정된 추가 Page**:
```
src/pages/
├── payment/            # 결제 페이지 (예정)
└── result/             # 결과 페이지 (예정)
```

---

### `src/widgets/` — Widgets Layer (FSD)

복합 UI 블록. 여러 Features와 Entities를 조합한 재사용 가능한 UI 단위.

**현재 구조**:
```
src/widgets/
├── step-header/        # Step 공통 헤더 위젯
│   ├── ui/
│   │   ├── step-header.tsx
│   │   ├── step-header.test.tsx
│   │   └── step-header.stories.tsx
│   └── index.ts
└── README.md
```

**예정된 Widget**:
```
src/widgets/
├── header/             # 헤더 (예정)
├── step-indicator/     # Step 진행 표시기 (예정)
└── result-card/        # 결과 이미지 카드 (예정)
```

**참고**: Step Router는 App Layer (`src/app/router/`)로 이동됨 (여러 Pages를 조합하여 애플리케이션 전체 라우팅 담당)

---

### `src/shared/` — Shared Layer (FSD)

공통 코드. 프로젝트 전반에서 재사용되는 UI 컴포넌트, 유틸, 훅, 상수.

**현재 구조**:
```
src/shared/
├── components/
│   └── ui/             # Shadcn/UI 기반 컴포넌트
│       ├── button.tsx
│       ├── button.test.tsx
│       ├── button.stories.tsx
│       ├── next-step-button.tsx
│       ├── next-step-button.test.tsx
│       └── next-step-button.stories.tsx
└── lib/
    ├── utils.ts        # cn() 등 유틸 함수
    ├── index.ts
    └── example.test.ts
```

**예정된 확장**:
```
src/shared/
├── components/
│   └── ui/             # Button, Input, Modal, Card 등
├── lib/                # 유틸 함수
├── hooks/              # 커스텀 훅
├── types/              # 공통 타입 정의
└── constants/          # 상수 정의
```

---

### `e2e/` — Playwright E2E 테스트

Playwright 기반 E2E 테스트.

**예정된 구조**:
```
e2e/
├── photo-mode.spec.ts  # Photo Mode Happy Path
├── map-mode.spec.ts    # Map Mode Happy Path
└── README.md
```

---

### `mocks/` — MSW (Mock Service Worker)

API Mocking. 개발/테스트 환경에서 외부 API 대체.

**현재 구조**:
```
mocks/
├── handlers/
│   ├── azure-face.ts   # Azure Face Mock
│   ├── gemini-nanobanana.ts # Gemini generateContent Mock
│   └── index.ts        # Azure/Gemini/Google/Toss Mock
├── browser.ts          # 브라우저 환경 MSW
├── node.ts             # Node 환경 MSW
└── README.md
```

---

## 🛠️ Configuration Files

### `biome.json`
Biome Lint/Format 설정. ESLint + Prettier 대체.

### `vitest.config.ts`
Vitest 단위/통합 테스트 설정.

### `playwright.config.ts`
Playwright E2E 테스트 설정.

### `lefthook.yml`
Git Hooks 설정. pre-commit 시 Biome Lint/Format 자동 실행.

### `components.json`
Shadcn/UI 설정. 컴포넌트 설치 경로 및 스타일 정의.

### `next.config.ts`
Next.js 설정. 실험적 기능, 이미지 최적화 등.

### `tsconfig.json`
TypeScript 설정. Path Alias (`@/`) 정의.

---

## 🔄 Update Protocol

이 문서는 다음 시점에 업데이트된다:

1. **새로운 디렉토리/파일 추가 시**
2. **Layer 구조 변경 시**
3. **아키텍처 패턴 변경 시**
4. **주요 기능 개발 완료 시**

---

## [2025-12-16] 업데이트
- 추가: src/widgets/step-header/ — Step 공통 헤더 위젯(뒤로가기 조건 노출)
- 변경: src/pages/select-mode/ui/select-mode-page.tsx — StepHeader로 공통 헤더 조합
- 변경: src/pages/upload-photo/ui/upload-photo-page.tsx — StepHeader로 공통 헤더 조합
- 변경: src/features/select-mode/ui/select-mode-view.tsx — 헤더 영역 제거(콘텐츠만 유지)
- 변경: src/features/upload-photo/ui/upload-photo-view.tsx — 헤더/뒤로가기 제거, 미리보기 URL 언마운트 정리

## [2025-12-17] 업데이트
- 추가: src/features/upload-photo/model/use-upload-dropzone.ts — Dropzone 로직을 model 훅으로 분리
- 추가: src/features/upload-photo/model/use-upload-photo-flow.ts — 업로드 성공 시 Step 전환을 외부 콜백으로 오케스트레이션
- 변경: src/features/upload-photo/ui/upload-dropzone.tsx — UI 컴포넌트는 props 기반 렌더링만 수행
- 변경: src/features/upload-photo/model/use-photo-upload.ts — 업로드 훅에서 Step 전환 제거(성공 콜백 주입)
- 변경: src/features/upload-photo/ui/upload-photo-view.tsx — `useUploadPhotoFlow`로 Step 전환 의존성 분리
- 변경: src/features/upload-photo/ui/photo-preview.tsx — 이미지 렌더링 `next/image`로 전환(프리뷰는 `unoptimized`)

## [2025-12-17] 업데이트
- 추가: src/features/select-mode/ui/select-mode-view.test.tsx — SelectModeView 유닛 테스트
- 추가: src/features/select-mode/ui/select-mode-view.stories.tsx — SelectModeView 스토리
- 추가: src/features/upload-photo/ui/*.test.tsx — UPLOAD UI 유닛 테스트
- 추가: src/features/upload-photo/ui/*.stories.tsx — UPLOAD UI 스토리
- 추가: src/pages/select-mode/ui/*.test.tsx — SELECT_MODE Page 유닛 테스트
- 추가: src/pages/select-mode/ui/*.stories.tsx — SELECT_MODE Page 스토리
- 추가: src/pages/upload-photo/ui/*.test.tsx — UPLOAD Page 유닛 테스트
- 추가: src/pages/upload-photo/ui/*.stories.tsx — UPLOAD Page 스토리
- 추가: src/widgets/step-header/ui/step-header.stories.tsx — StepHeader 스토리
- 추가: .storybook/next-image.ts — Storybook에서 `next/image` 대체 렌더러
- 변경: .storybook/main.ts — Storybook Vite alias(`next/image`) 설정
- 변경: vitest.setup.ts — 테스트에서 `next/image` mock 추가
- 변경: src/features/upload-photo/ui/upload-photo-view.tsx — 테스트/스토리용 flow 주입 지원
- 변경: src/pages/upload-photo/ui/upload-photo-page.tsx — 테스트/스토리용 flow 주입 지원

## [2025-12-17] 업데이트
- 추가: src/entities/photo/ — Step 간 선택 파일 상태 유지 엔티티
- 추가: src/entities/photo/model/store.ts — 선택된 `File` 저장 Store(Zustand)
- 변경: src/features/upload-photo/model/use-upload-photo-flow.ts — 파일 선택 후 `entities/photo` 저장 + MATCH 이동
- 변경: src/features/upload-photo/model/use-photo-upload.ts — 가짜 업로드/로딩 제거, `onNext` 콜백으로 단순화

## [2025-12-17] 업데이트 - MATCH/EXPRESSION Step 구현
- 추가: src/entities/person/ — 인물 마커 상태 관리 엔티티
- 추가: src/entities/person/model/types.ts — PersonColor, MarkerTransform, Person, PersonState 타입 정의
- 추가: src/entities/person/model/store.ts — Person Store (Zustand) - 초기화/재초기화, 최대 5명, 고정 색상 순서
- 추가: src/features/match-photo/ — MATCH Step UI 컴포넌트들
- 추가: src/features/match-photo/ui/person-marker.tsx — 드래그/스케일/회전 마커
- 추가: src/features/match-photo/ui/person-button.tsx — 하단 사람 버튼
- 추가: src/features/match-photo/ui/add-person-button.tsx — 사람 추가 버튼
- 추가: src/features/match-photo/ui/person-list-panel.tsx — 하단 패널 (초기화 버튼 포함)
- 추가: src/features/match-photo/ui/image-canvas.tsx — 베이스 이미지 + 마커 오버레이
- 추가: src/features/match-photo/ui/match-photo-view.tsx — MATCH Step 메인 뷰
- 추가: src/features/expression-select/ — EXPRESSION Step (placeholder)
- 추가: src/pages/match-photo/ — MATCH 페이지
- 추가: src/pages/expression-select/ — EXPRESSION 페이지
- 변경: src/entities/step/model/step.ts — EXPRESSION Step 추가
- 변경: src/entities/step/model/transition.ts — MATCH → EXPRESSION → PAYMENT 전이 규칙
- 변경: src/app/router/step-router.tsx — MATCH, EXPRESSION 페이지 라우팅 추가

## [2025-12-17] 업데이트 - PersonMarker 기능 개선
- 변경: src/entities/person/model/types.ts — MarkerTransform에 imageOffsetX, imageOffsetY 필드 추가
- 변경: src/entities/person/model/store.ts — DEFAULT_TRANSFORM에 imageOffset 기본값 추가
- 변경: src/features/match-photo/ui/person-marker.tsx — 회전 기능 개선 (회전 wrapper 분리), 이미지 오프셋 핸들 추가
- 변경: src/features/match-photo/ui/person-button.tsx — layout 애니메이션 제거 (버벅임 해결)
- 변경: src/features/match-photo/ui/person-list-panel.tsx — AnimatePresence mode를 sync로 변경
- 변경: src/features/match-photo/ui/image-canvas.tsx — onImageOffsetChange prop 추가
- 변경: src/features/match-photo/ui/match-photo-view.tsx — 이미지 오프셋 핸들러 추가

## [2025-12-17] 업데이트 - MATCH/EXPRESSION 테스트·스토리 보강
- 추가: src/features/match-photo/ui/*.test.tsx — MATCH UI 유닛 테스트
- 추가: src/features/match-photo/ui/*.stories.tsx — MATCH UI 스토리
- 추가: src/pages/match-photo/ui/*.test.tsx — MATCH Page 유닛 테스트
- 추가: src/pages/match-photo/ui/*.stories.tsx — MATCH Page 스토리
- 추가: src/features/expression-select/ui/*.test.tsx — EXPRESSION UI 유닛 테스트
- 추가: src/features/expression-select/ui/*.stories.tsx — EXPRESSION UI 스토리
- 추가: src/pages/expression-select/ui/*.test.tsx — EXPRESSION Page 유닛 테스트
- 추가: src/pages/expression-select/ui/*.stories.tsx — EXPRESSION Page 스토리
- 추가: src/entities/person/model/store.test.ts — Person Store 유닛 테스트
- 추가: src/entities/person/model/export-for-ai.test.ts — MATCH 데이터 내보내기 유틸 유닛 테스트
- 변경: src/features/match-photo/ui/person-button.tsx — 중첩 button 제거(하이드레이션 오류 방지)
- 변경: vitest.setup.ts — next/image mock 개선 + pointer capture polyfill

## [2025-12-17] 업데이트 - Biome lint 정리 및 검사 규칙
- 변경: src/entities/person/index.ts — Public API를 named export로 변경(noReExportAll 대응)
- 변경: src/entities/person/model/index.ts — model Public API를 named export로 변경(noReExportAll 대응)
- 변경: src/entities/person/model/store.ts — 액션 분리/타입 정리로 Biome lint 대응
- 변경: src/features/match-photo/ui/person-marker.tsx — 로직 분리 + `next/image`로 전환(noImgElement/noExcessiveLines 대응)
- 변경: src/features/match-photo/ui/person-list-panel.tsx — 리스트 렌더링 분리(useSolidForComponent 경고 대응)
- 변경: src/features/match-photo/ui/image-canvas.tsx — 리스트 렌더링 분리(useSolidForComponent 경고 대응)
- 변경: src/features/expression-select/ui/expression-select-view.tsx — `next/image`로 전환 + 리스트 렌더링 정리
- 변경: .ruler/AGENTS.md — 코드 변경 시 `pnpm check`를 통과할 때까지 보완 규칙 추가
- 변경: src/features/match-photo/ui/person-button.tsx — 카드 영역 클릭으로 Active 선택 가능하도록 UX 복원(중첩 button 없이 처리)
- 변경: src/features/match-photo/ui/person-list-panel.tsx — 업로드 클릭 시 대상 인물을 Active로 자동 선택


## 📌 Key Principles

### 1. Single Responsibility
각 Layer는 명확한 책임을 가진다.

- **app**: 애플리케이션 초기화, 전역 프로바이더, 라우팅
- **pages**: 페이지 단위 조합 (features + entities + widgets)
- **widgets**: 복합 UI 블록 (여러 features/entities 조합)
- **features**: 비즈니스 기능 (쓰기 작업 + 사용자 의도)
- **entities**: 비즈니스 엔티티 (읽기 전용 + 순수 UI)
- **shared**: 공통 코드 (UI 컴포넌트, 유틸, 훅, 상수)

### 2. Unidirectional Dependency
상위 → 하위 방향으로만 의존성 흐름.

```
app → pages → widgets → features → entities → shared
```

### 3. Isolation
같은 Layer 간 참조 금지.

**금지 예시**:
```typescript
// ❌ features/A → features/B (같은 Layer 참조 금지)
// ❌ pages/A → pages/B (같은 Layer 참조 금지)

// ✅ features/A → entities/B (하위 Layer 참조 허용)
// ✅ pages/A → features/B (하위 Layer 참조 허용)
```

### 4. Scalability
기능 추가 시 기존 코드 수정 최소화.

### 5. Testability
각 Layer는 독립적으로 테스트 가능.

### 6. FSD 구조 규칙 준수

**일반 Layer** (pages, widgets, features, entities):
```
Layer → Slice → Segment
```

**특수 Layer** (app, shared):
```
Layer → Segment (Slice 없음!)
```

---

## 📚 References

- [FSD Documentation](https://feature-sliced.design)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [MSW](https://mswjs.io)

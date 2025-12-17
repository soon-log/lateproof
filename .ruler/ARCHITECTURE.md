# LateProof — Architecture Documentation

> **목적**: 프로젝트 폴더 구조와 아키텍처 패턴 정의  
> **갱신 방식**: 기능 개발 완료 시마다 업데이트  
> **Last Updated**: 2025-12-17 (UI 테스트/스토리 보강 + Storybook/Vitest `next/image` 대응)

---

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
src/pages/upload/ (예정)
src/pages/match/ (예정)
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
  - `Step` (as const 패턴): `SELECT_MODE`, `UPLOAD`, `MATCH`, `PAYMENT`, `GENERATE`, `RESULT`
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
├── upload-photo/       # 사진 업로드 기능 (Epic 2.3 진행 중)
│   ├── model/
│   │   ├── file.ts                # 파일 제약(크기/타입)
│   │   ├── use-upload-dropzone.ts # Dropzone 로직 훅(react-dropzone 래핑)
│   │   ├── use-photo-upload.ts    # 업로드 훅(파일 선택/프리뷰/업로드)
│   │   └── use-upload-photo-flow.ts # Step 전환 오케스트레이션(성공 콜백 주입)
│   ├── ui/
│   │   ├── helper-text.tsx
│   │   ├── helper-text.test.tsx
│   │   ├── helper-text.stories.tsx
│   │   ├── photo-preview.tsx       # 사진 미리보기(Next Image, blob 프리뷰는 unoptimized)
│   │   ├── photo-preview.test.tsx
│   │   ├── photo-preview.stories.tsx
│   │   ├── upload-dropzone.tsx     # Dropzone UI (presentational)
│   │   ├── upload-dropzone.test.tsx
│   │   ├── upload-dropzone.stories.tsx
│   │   ├── upload-photo-view.tsx   # 업로드 뷰 (flow 주입 가능)
│   │   ├── upload-photo-view.test.tsx
│   │   └── upload-photo-view.stories.tsx
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
├── upload-image/       # 이미지 업로드 기능 (예정)
│   ├── ui/             # Dropzone 컴포넌트
│   └── api/            # Server Action
├── match-faces/        # 얼굴 매칭 기능 (예정)
│   ├── ui/             # 원 선택 UI
│   └── lib/            # 좌표 계산 로직
├── verify-face/        # 얼굴 검증 기능 (예정)
│   └── api/            # Azure Face API Wrapper
├── process-payment/    # 결제 처리 기능 (예정)
│   └── api/            # Toss Payments 연동
└── generate-image/     # 이미지 생성 기능 (예정)
    ├── ui/             # 생성 결과 UI
    └── api/            # Nanobanana API Wrapper
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
├── upload-photo/       # 사진 업로드 페이지 (Epic 2.3 진행 중)
│   ├── ui/
│   │   ├── upload-photo-page.tsx
│   │   ├── upload-photo-page.test.tsx
│   │   └── upload-photo-page.stories.tsx
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
├── match/              # 매칭 페이지 (예정)
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
│       └── button.stories.tsx
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
│   └── index.ts        # Azure, Nanobanana, Google, Toss Mock
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

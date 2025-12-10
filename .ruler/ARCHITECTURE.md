# LateProof — Architecture Documentation

> **목적**: 프로젝트 폴더 구조와 아키텍처 패턴 정의  
> **갱신 방식**: 기능 개발 완료 시마다 업데이트  
> **Last Updated**: 2025-12-10 (Epic 2.1 완료 — FSM 구축)

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
│   ├── globals.css           # 전역 스타일 (Tailwind CSS)
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 루트 페이지
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
│   ├── app/                  # App Layer (앱 초기화, 프로바이더)
│   │   └── README.md
│   │
│   ├── entities/             # Entities Layer (비즈니스 엔티티, 읽기 전용)
│   │   ├── step/             # Step 엔티티 (워크플로우 상태 관리)
│   │   │   ├── model/        # 도메인 모델
│   │   │   │   ├── step.ts   # Step as const, STEP_META, STEP_ORDER
│   │   │   │   ├── transition.ts  # FSM Transition Table
│   │   │   │   ├── types.ts  # Mode, StepState, StepTransitionContext
│   │   │   │   ├── store.ts  # Step FSM Store (Zustand)
│   │   │   │   ├── store.test.ts  # Store Unit Test (14 tests)
│   │   │   │   └── index.ts  # model Public API
│   │   │   └── index.ts      # entity Public API
│   │   └── README.md
│   │
│   ├── features/             # Features Layer (비즈니스 기능, 쓰기 작업)
│   │   └── README.md
│   │
│   ├── pages/                # Pages Layer (페이지 조합)
│   │   └── README.md
│   │
│   ├── shared/               # Shared Layer (공통 코드)
│   │   ├── components/       # 공통 UI 컴포넌트
│   │   │   └── ui/           # Shadcn/UI 기반 컴포넌트
│   │   │       ├── button.tsx
│   │   │       ├── button.test.tsx
│   │   │       └── button.stories.tsx
│   │   └── lib/              # 공통 유틸리티
│   │       ├── utils.ts      # cn() 등 유틸 함수
│   │       ├── index.ts
│   │       └── example.test.ts
│   │
│   └── widgets/              # Widgets Layer (복합 UI 블록)
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

- `layout.tsx`: 전역 레이아웃 (메타데이터, 폰트, 프로바이더)
- `page.tsx`: 루트 페이지 (`/`)
- `globals.css`: Tailwind CSS 전역 스타일

---

### `src/app/` — App Layer (FSD)

앱 초기화, 전역 프로바이더, 라우팅 설정.

**현재 구조**:
```
src/app/
└── README.md
```

**예정된 구조**:
```
src/app/
├── providers/          # React Query Provider (예정)
│   └── query-provider.tsx
└── README.md
```

**역할**:
- 전역 프로바이더 설정 (React Query, Theme 등)
- 앱 레벨 라우팅 및 레이아웃 구성
- **엔티티별 Store는 각 entities에 포함** (예: Step Store → entities/step/model/store.ts)

---

### `src/entities/` — Entities Layer (FSD)

비즈니스 엔티티 정의. **읽기 전용 작업 (GET)** 중심.

**현재 구조**:
```
src/entities/
├── step/               # Step 엔티티 (워크플로우 FSM)
│   ├── model/
│   │   ├── step.ts     # Step as const 패턴, STEP_META, STEP_ORDER
│   │   ├── transition.ts  # TRANSITION_TABLE, canTransition, validateTransition
│   │   ├── types.ts    # Mode, StepState, StepTransitionContext
│   │   ├── store.ts    # Step FSM Store (Zustand)
│   │   ├── store.test.ts  # Store Unit Test (14 tests)
│   │   └── index.ts    # model Public API
│   └── index.ts        # entity Public API
└── README.md
```

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

**예정된 구조**:
```
src/features/
├── upload-image/       # 이미지 업로드 기능
│   ├── ui/             # Dropzone 컴포넌트
│   └── api/            # Server Action
├── match-faces/        # 얼굴 매칭 기능
│   ├── ui/             # 원 선택 UI
│   └── lib/            # 좌표 계산 로직
├── verify-face/        # 얼굴 검증 기능
│   └── api/            # Azure Face API Wrapper
├── process-payment/    # 결제 처리 기능
│   └── api/            # Toss Payments 연동
└── generate-image/     # 이미지 생성 기능
    ├── ui/             # 생성 결과 UI
    └── api/            # Nanobanana API Wrapper
```

---

### `src/pages/` — Pages Layer (FSD)

페이지 단위 조합. Features와 Entities를 조합하여 완전한 페이지 구성.

**예정된 구조**:
```
src/pages/
├── select-mode/        # 모드 선택 페이지
├── upload/             # 업로드 페이지
├── match/              # 매칭 페이지
├── payment/            # 결제 페이지
└── result/             # 결과 페이지
```

---

### `src/widgets/` — Widgets Layer (FSD)

복합 UI 블록. 여러 Features와 Entities를 조합한 재사용 가능한 UI 단위.

**예정된 구조**:
```
src/widgets/
├── header/             # 헤더
├── step-indicator/     # Step 진행 표시기
└── result-card/        # 결과 이미지 카드
```

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

**Update Format**:
```markdown
## [날짜] 업데이트
- 추가: [디렉토리/파일 경로] — [설명]
- 변경: [기존 구조] → [새 구조]
- 삭제: [디렉토리/파일 경로] — [사유]
```

---

## 📅 변경 이력

### 2025-12-10 업데이트
- **추가**: `src/entities/step/model/store.ts` — Step FSM Store (Zustand)
- **추가**: `src/entities/step/model/store.test.ts` — Store Unit Test (14 tests)
- **변경**: `src/app/store/` → `src/entities/step/model/` — Store 위치 재배치
- **사유**: Step Store는 Step 엔티티에만 종속되므로 entities/step에 포함하는 것이 FSD 원칙에 부합
- **결정**: 엔티티별 Store는 해당 entities 내부에 배치 (App Layer는 여러 엔티티 조합 시에만 사용)

---

## 📌 Key Principles

### 1. Single Responsibility
각 Layer는 명확한 책임을 가진다.

### 2. Unidirectional Dependency
상위 → 하위 방향으로만 의존성 흐름.

### 3. Isolation
같은 Layer 간 참조 금지.

### 4. Scalability
기능 추가 시 기존 코드 수정 최소화.

### 5. Testability
각 Layer는 독립적으로 테스트 가능.

---

## 📚 References

- [FSD Documentation](https://feature-sliced.design)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [MSW](https://mswjs.io)

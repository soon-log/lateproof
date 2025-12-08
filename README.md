# 🕐 LateProof

> 난감한 순간, 즉시 인증샷을 생성하는 AI 서비스

**"엄마 저 친구랑 놀고있어요!"**

---

## 📝 개요

부모님, 연인, 친구에게 필요한 순간에 자연스럽고 진짜처럼 보이는 "즉석 인증샷 이미지"를 생성하는 서비스입니다.

### 핵심 기능

- 📸 **사진 기반** / 🗺️ **지도 기반** 모드 선택
- 👥 최대 5명까지 인물 생성
- 😄 표정 선택 (기쁨/놀람/평온)
- 🎨 아이폰 촬영 톤의 자연스러운 합성
- 💳 단건 결제 (300~500원)
- 🔒 게스트 기반 / 데이터 즉시 삭제

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **UI Components**: Shadcn/UI (Radix)
- **Animation**: Framer Motion
- **State**: Zustand (FSM)
- **Server State**: TanStack Query

### Backend
- **Runtime**: Next.js Server Actions
- **Deployment**: Vercel Edge Functions

### AI & External APIs
- **이미지 생성**: Nanobanana API
- **얼굴 검증**: Azure Face API
- **지도/장소**: Google Maps SDK
- **결제**: Toss Payments

### Dev Tools
- **Linter/Formatter**: Biome
- **Git Hooks**: Lefthook
- **Testing**: Vitest, React Testing Library, Playwright
- **Mock**: MSW
- **Monitoring**: Sentry
- **UI Catalog**: Storybook

---

## 📦 설치 및 실행

### 1. 패키지 설치

```bash
pnpm install
```

### 2. Git Hooks 설정

```bash
pnpm prepare
```

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```env
# Azure Face API
AZURE_FACE_API_KEY=your_key
AZURE_FACE_ENDPOINT=your_endpoint

# Nanobanana API
NANOBANANA_API_KEY=your_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

# Toss Payments
TOSS_CLIENT_KEY=your_key
TOSS_SECRET_KEY=your_key
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3000 접속

---

## 🧪 테스트

```bash
# Unit & Integration Tests
pnpm test

# Unit Tests (watch mode)
pnpm test:unit

# E2E Tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

---

## 🔧 Git Hooks (Lefthook)

프로젝트는 **Lefthook**을 사용하여 코드 품질을 자동으로 관리합니다.

### Pre-commit Hook

커밋 전 자동 실행:

- ✅ Biome Lint & Format
- ✅ TypeScript Type Check

```bash
# Staged 파일만 검사
git add .
git commit -m "feat: add new feature"
# → 자동으로 lint, format, typecheck 실행
```

### Pre-push Hook

푸시 전 자동 실행:

- ✅ Unit & Integration Tests (Vitest)

```bash
git push
# → 자동으로 테스트 실행
```

### Hook 일시 비활성화

긴급 상황에서 hook 우회:

```bash
# 모든 hook 비활성화
LEFTHOOK=0 git commit -m "emergency fix"

# 특정 hook만 비활성화
LEFTHOOK_EXCLUDE=pre-commit git commit -m "skip pre-commit"
```

---

## 🏗️ 아키텍처 (FSD)

```
src/
├── app/          # Routing (Next.js App Router)
├── features/     # Write operations (Server Actions, Mutations)
├── entities/     # Read operations (Data fetching, View)
├── shared/       # Reusable utilities, UI components
└── widgets/      # Composite UI blocks
```

**FSD (Feature-Sliced Design)** 구조를 따릅니다.

- `features`: 사용자 의도를 담은 기능 (업로드, 결제, 생성 등)
- `entities`: 비즈니스 엔티티 (이미지, 얼굴, 장소 등)
- `shared`: 공통 컴포넌트, 유틸, 상수

---

## 🎯 개발 가이드

### 코드 스타일

```bash
# Lint 체크
pnpm lint

# Format 자동 수정
pnpm format
```

### Storybook

```bash
# Storybook 실행 (설치 후)
pnpm storybook
```

### 빌드

```bash
pnpm build
```

---

## 📚 문서

- [PRD (Product Requirements Document)](.ruler/PRD.md)
- [TASKS (작업 목록)](.ruler/TASKS.md)
- [PLAN (진행 상황)](.ruler/PLAN.md)
- [AGENTS (AI 규칙)](.ruler/AGENTS.md)

---

## 📊 프로젝트 진행률

현재 진행 상황은 [PLAN.md](.ruler/PLAN.md)에서 확인하세요.

- **Phase**: M1 — Foundation Setup
- **진행률**: 7.1% (11/155 tasks)

---

## 🤝 기여

이 프로젝트는 **비공개 프로젝트**입니다.

---

## 📄 라이선스

Private License

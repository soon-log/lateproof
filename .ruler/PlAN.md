# LateProof — Implementation Plan

> **목적**: AI가 스스로 진행상황을 파악하고 다음 작업을 결정하기 위한 Task 관리 도구  
> **갱신 방식**: 작업 완료 시마다 이 문서를 업데이트  
> **Last Updated**: 2025-12-17 (Azure Face 검증 실패 토스트(Shadcn/Sonner) 적용)

---

## 📊 Current Status

**현재 Phase**: `M2 — Photo Mode Core Flow`  
**전체 진행률**: `26.1%` (42/161 tasks)  
**현재 작업 중**: M2-E5-T03 (표정 선택 UI)  
**차단 요소**: 없음

---

## 🎯 Current Focus

### 지금 작업 중인 Task

- [x] M2-E4-T01: Person 마커 시스템 구현 ✅ 완료
- [x] M2-E4-T02: 마커 스케일/회전 핸들 구현 ✅ 완료
- [x] M2-E4-T03: 얼굴 사진 업로드 및 이미지 오프셋/크기 조정 ✅ 완료
- [x] M2-E4-T04: 인물 설정 패널 UI ✅ 완료
- [x] M2-E4-T05: 뒤로가기 시 Person 상태 초기화 ✅ 완료
- [x] M2-E4-T06: AI 이미지 생성용 데이터 내보내기 유틸리티 ✅ 완료
- [x] M2-E5-T01: EXPRESSION Step FSM 전이 규칙 ✅ 완료
- [x] M2-E5-T02: ExpressionSelectView 플레이스홀더 ✅ 완료

**🎉 Epic 2.4 — MATCH Step 구현 + 테스트/스토리 완료!**

### 다음 작업 (우선순위 순)

1. **M2-E5-T03**: 인물별 표정 선택 UI 구현
2. **M2-E5-T04**: 표정 데이터 저장 및 AI 전달용 포맷
3. **M2-E7-T01**: Toss Payments SDK 연동

---

## ✅ Completed Tasks

### Milestone 1 — Foundation Setup

#### Epic 1.1 — Repository & Environment ✅ 완료
- [x] M1-E1-T01: GitHub Repository 생성 (git repo 확인)
- [x] M1-E1-T02: README 초기 템플릿 작성 (README.md 존재)
- [x] M1-E1-T03: Biome 초기 설정 (biome.json 완전 설정 완료)
- [x] M1-E1-T03-1: Lefthook Git Hooks 설정 (lefthook.yml 생성, package.json 스크립트 추가)
- [x] M1-E1-T04: Vercel 프로젝트 생성 (사용자 확인 완료)
- [x] M1-E1-T05: 환경 변수 구조 설계 (.env.example 생성 완료)

#### Epic 1.2 — Next.js + FSD 구조
- [x] M1-E2-T01: Next.js App Router 초기화 (app/layout.tsx, page.tsx 존재)
- [x] M1-E2-T02: src/ 디렉토리 구조 생성 (src/ 완료)
- [x] M1-E2-T03: FSD Layer 구축 (app/features/entities/shared/widgets 모두 존재)

#### Epic 1.3 — UI Design System & Storybook ✅ 완료
- [x] M1-E3-T01: TailwindCSS 설치 (tailwindcss v4, globals.css 확인)
- [x] M1-E3-T02: Shadcn 초기화 (components.json, @radix-ui/react-slot 확인)
- [x] M1-E3-T03: 기본 UI 컴포넌트 작성 — Button만 완료 (shared/components/ui/button.tsx)
- [x] M1-E3-T04: SG.md 기반 스타일 시스템 구축 (완료)
- [x] M1-E3-T05: Storybook 설치 (완료 — v10.1.5, nextjs-vite)

#### Epic 1.4 — Testing Environment Setup ✅ 완료
- [x] M1-E4-T01: Vitest 설치 및 설정 (vitest.config.ts, vitest.setup.ts 생성)
- [x] M1-E4-T02: Testing Library 설치 및 setup (@testing-library/react, jest-dom, user-event)
- [x] M1-E4-T03: MSW 설치 및 핸들러 구조 생성 (src/mocks 완료)
- [x] M1-E4-T04: Playwright 설치 및 설정 (playwright.config.ts, e2e/ 완료)
- [x] M1-E4-T05: package.json 테스트 스크립트 추가 및 Lefthook 통합

### Milestone 2 — Photo Mode Core Flow

#### Epic 2.1 — FSM 구축 ✅ 완료
- [x] M2-E1-T01: Step Enum 정의 (src/entities/step/model/step.ts)
- [x] M2-E1-T02: Transition Table 정의 (src/entities/step/model/transition.ts)
- [x] M2-E1-T03: Zustand FSM Store 구축 (src/entities/step/model/store.ts + store.test.ts)

#### Epic 2.2 — SELECT_MODE Step ✅ 완료
- [x] M2-E2-T01: Photo/Map 선택 UI + UI 테스트/스토리 (src/features/select-mode/ui/mode-card.tsx, src/features/select-mode/ui/select-mode-view.tsx)
- [x] M2-E2-T02: Step 이동 처리 + Page 테스트/스토리 (src/pages/select-mode/ui/select-mode-page.tsx)
- [x] M2-E2-T03: 페이지 전환 애니메이션 + Step 공통 레이아웃(너비/헤더) + StepHeader 스토리 (src/app/router/step-router.tsx, src/widgets/step-header/ui/step-header.tsx)

#### Epic 2.3 — UPLOAD Step ✅ 완료
- [x] M2-E3-T01: 이미지 업로드(파일 선택) + 파일 상태 저장(entities/photo) + MATCH 이동 (src/entities/photo/model/store.ts, src/features/upload-photo/model/use-upload-photo-flow.ts)

#### Epic 2.4 — MATCH Step ✅ 완료 (7/7 tasks)
- [x] M2-E4-T01: Person 마커 시스템 구현 + 인물 추가 시 기본 스택 배치 (src/entities/person/model/store.ts, src/features/match-photo/ui/person-marker.tsx)
- [x] M2-E4-T02: 마커 스케일/회전 핸들 구현 (Active 상태에서만 표시)
- [x] M2-E4-T03: 얼굴 사진 업로드 및 이미지 오프셋/크기 조정 기능
- [x] M2-E4-T04: 인물 설정 패널 UI (src/features/match-photo/ui/person-list-panel.tsx)
- [x] M2-E4-T05: 뒤로가기 시 Person 상태 초기화 (StepHeader onBeforeBack prop)
- [x] M2-E4-T06: AI 이미지 생성용 데이터 내보내기 유틸리티 (src/entities/person/model/export-for-ai.ts)
- [x] M2-E4-T07: MATCH Step 컴포넌트 테스트/스토리 작성

#### Epic 2.5 — EXPRESSION Step 🚧 진행 중 (2/4 tasks)
- [x] M2-E5-T01: EXPRESSION Step FSM 전이 규칙 추가
- [x] M2-E5-T02: ExpressionSelectView 플레이스홀더 UI (src/features/expression-select/ui/expression-select-view.tsx)
- [ ] M2-E5-T03: 인물별 표정 선택 UI 구현
- [ ] M2-E5-T04: 표정 데이터 저장 및 AI 전달용 포맷

#### Epic 2.6 — 얼굴 검증 (MATCH Step 통합) ✅ 완료 (4/4 tasks)
- [x] M2-E6-T01: Azure Face API Wrapper 작성 (app/api/face/validate/route.ts)
- [x] M2-E6-T02: MATCH Step에서 얼굴 사진 업로드 시 Azure Face 검증 통합 (src/features/match-photo/ui/match-photo-view.tsx)
- [x] M2-E6-T03: 검증 실패 시 사용자 피드백 UI (Shadcn/Sonner toast로 표시)
- [x] M2-E6-T04: 검증 통과 시 다음 단계 진행 허용 (검증 성공 시에만 facePhoto 설정)

### 통계
- **완료**: 42 tasks
- **진행 중**: 1 tasks
- **남은 작업**: 118 tasks

### Epic 완료 현황
- **M1-E1**: ✅ 100% (6/6 tasks) — Repository & Environment 완료
- **M1-E2**: ✅ 100% (3/3 tasks) — Next.js + FSD 구조 완료
- **M1-E3**: ✅ 100% (5/5 tasks) — UI Design System & Storybook 완료
- **M1-E4**: ✅ 100% (5/5 tasks) — Testing Environment Setup 완료
- **M2-E1**: ✅ 100% (3/3 tasks) — FSM 구축 완료
- **M2-E2**: ✅ 100% (3/3 tasks) — SELECT_MODE Step 완료
- **M2-E3**: ✅ 100% (1/1 tasks) — UPLOAD Step 완료
- **M2-E4**: ✅ 100% (7/7 tasks) — MATCH Step 완료
- **M2-E5**: 🚧 50% (2/4 tasks) — EXPRESSION Step 진행 중
- **M2-E6**: ✅ 100% (4/4 tasks) — 얼굴 검증 완료


---

## 🚧 Blocked Tasks

현재 차단된 작업 없음.

---

## 📝 Implementation Notes

### Phase별 체크리스트

#### Phase 1: Foundation (M1) — ✅ 완료 (100%)
- [x] Next.js 프로젝트 초기화
- [x] FSD 구조 완성
- [x] Biome 설정
- [x] 환경 변수 구조 설계 (.env.example)
- [x] Vercel 배포 설정
- [x] SG.md 스타일 시스템
- [x] Storybook 설치 (v10.1.5, nextjs-vite)
- [x] Testing Environment 설정 (Vitest, Testing Library, MSW, Playwright)
- [x] 기본 UI 컴포넌트 — Button 완료 및 테스트 작성

#### Phase 2: Photo Mode (M2) — 🚧 진행 중 (7/27 tasks, 25.9%)
- [x] Step Enum 정의 (as const 패턴)
- [x] Transition Table 정의 (FSM 규칙)
- [x] Zustand FSM Store 구축 (14 tests 통과)
- [x] SELECT_MODE Step UI 구현 (ModeCard, SelectModeView)
- [x] StepRouter 구현 (Framer Motion 페이지 전환)
- [x] Framer Motion 설치 및 애니메이션 적용
- [x] UPLOAD Step 구현
- [x] Azure Face API 연동
- [ ] Toss Payments 연동
- [ ] Nanobanana API 연동

#### Phase 3: Map Mode (M3) — 대기
- [ ] Google Maps SDK 연동
- [ ] 장소 검색 UI
- [ ] Prompt Builder

#### Phase 4: AI Generation (M4) — 대기
- [ ] 이미지 생성 로직
- [ ] 메모리 관리

#### Phase 5: Testing (M5) — 대기
- [ ] Unit Test
- [ ] Integration Test
- [ ] E2E Test

#### Phase 6: Deployment (M6) — 대기
- [ ] QA
- [ ] Sentry
- [ ] Vercel 배포

---

## 🔍 Context for AI

### 프로젝트 구조 현황

```
/app                     ✅ 존재 (layout.tsx, page.tsx, globals.css)
/src/app                 ✅ 존재 (README.md)
/src/entities            ✅ 존재 (README.md)
  └── /step              ✅ 생성 완료 (Step Entity — FSM 완전 구현)
      └── /model         ✅ step.ts, transition.ts, types.ts, store.ts, store.test.ts (14 tests)
/src/features            ✅ 존재 (README.md)
/src/pages               ✅ 존재 (README.md)
/src/shared              ✅ 존재 (components/ui, lib)
/src/widgets             ✅ 존재 (README.md)
```

### 설치된 패키지 (package.json 기준)

```json
{
  "next": "^15.1.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^3.4.17",
  "@biomejs/biome": "^1.9.4"
}
```

### 설치된 필수 패키지

- [x] `zustand` — FSM 상태 관리
- [x] `framer-motion` — 애니메이션
- [x] `@radix-ui/*` — Shadcn 기반 컴포넌트
- [x] `vitest` — 테스트 프레임워크
- [x] `@testing-library/react` — 컴포넌트 테스트
- [x] `msw` — API Mocking
- [x] `@playwright/test` — E2E 테스트
- [x] `@storybook/nextjs-vite` — UI 카탈로그

### 아직 설치되지 않은 필수 패키지

- [ ] `@tanstack/react-query` — 서버 상태 관리
- [ ] `react-dropzone` — 파일 업로드
- [ ] `@googlemaps/js-api-loader` — Google Maps
- [ ] `@azure/cognitiveservices-face` — Azure Face API
- [ ] `@toss/payments` — Toss Payments

---

## 🎬 Next Actions

### 즉시 수행 가능한 작업

1. **Biome 설정 완성**
   - `biome.json` 검증
   - Lint/Format 규칙 설정

2. **FSD 구조 완성**
   - 각 Layer별 index.ts 생성
   - 타입 정의 구조 설계

3. **필수 패키지 설치**
   - Zustand, React Query, Framer Motion

4. **Storybook 초기 설정**
   - 설치 및 기본 설정
   - Button 컴포넌트 Story 작성

### 준비 필요한 작업 (환경변수/인증)

- Azure Face API 키
- Google Maps API 키
- Nanobanana API 키
- Toss Payments 키

---

## 📌 Quick Reference

### PRD 핵심 요약
- **Flow**: SELECT_MODE → UPLOAD → MATCH → PAYMENT → GENERATE → RESULT
- **AI**: Nanobanana (생성), Azure (검증)
- **결제**: Toss Payments (300~500원)
- **아키텍처**: FSD (features/entities/shared)
- **상태관리**: Zustand FSM

### 기술 스택
- Next.js App Router
- React 18
- TailwindCSS + Shadcn/UI
- Framer Motion
- React Query + Zustand
- Vitest + Playwright + Storybook
- Biome

### 테스트 전략
- Unit: FSM, 얼굴 검증, Payload builder (50%+)
- Integration: 업로드→검증→결제→생성 (MSW)
- E2E: Photo/Map Mode Happy Path (Playwright)

---
## 🔄 Update Protocol

이 문서는 다음 시점에 업데이트됩니다:

1. Task 완료 시
2. 새로운 Phase 시작 시
3. 차단 요소 발생 시
4. 중요 결정 사항 발생 시

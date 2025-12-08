# LateProof — Implementation Plan

> **목적**: AI가 스스로 진행상황을 파악하고 다음 작업을 결정하기 위한 Task 관리 도구  
> **갱신 방식**: 작업 완료 시마다 이 문서를 업데이트  
> **Last Updated**: 2025-12-08

---

## 📊 Current Status

**현재 Phase**: `M1 — Foundation Setup`  
**전체 진행률**: `8.4%` (13/155 tasks)  
**현재 작업 중**: 없음  
**차단 요소**: 없음

---

## 🎯 Current Focus

### 지금 작업 중인 Task

- [ ] 없음

### 다음 작업 (우선순위 순)

1. **M1-E3-T04**: SG.md 기반 스타일 시스템 구축
2. **M1-E3-T05**: Storybook 설치
3. **M1-E3-T06**: Atomic UI 컴포넌트 stories 작성
4. **M2-E1-T01**: Step Enum 정의 (Phase 2 시작 준비)

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

#### Epic 1.3 — UI Design System & Storybook
- [x] M1-E3-T01: TailwindCSS 설치 (tailwindcss v4, globals.css 확인)
- [x] M1-E3-T02: Shadcn 초기화 (components.json, @radix-ui/react-slot 확인)
- [x] M1-E3-T03: 기본 UI 컴포넌트 작성 — Button만 완료 (shared/components/ui/button.tsx)
- [ ] M1-E3-T04: SG.md 기반 스타일 시스템 구축 (미완료)
- [ ] M1-E3-T05: Storybook 설치 (미완료)
- [ ] M1-E3-T06: Atomic UI 컴포넌트 stories 작성 (미완료)

### 통계
- **완료**: 13 tasks
- **진행 중**: 0 tasks
- **남은 작업**: 142 tasks

### Epic 완료 현황
- **M1-E1**: ✅ 100% (6/6 tasks) — Repository & Environment 완료
- **M1-E2**: ✅ 100% (3/3 tasks) — Next.js + FSD 구조 완료
- **M1-E3**: 🟡 50% (3/6 tasks) — UI Design System & Storybook 진행 중

---

## 🚧 Blocked Tasks

현재 차단된 작업 없음.

---

## 📝 Implementation Notes

### Phase별 체크리스트

#### Phase 1: Foundation (M1) — 진행 중 (66.7% 완료)
- [x] Next.js 프로젝트 초기화
- [x] FSD 구조 완성
- [x] Biome 설정
- [x] 환경 변수 구조 설계 (.env.example)
- [x] Vercel 배포 설정
- [ ] SG.md 스타일 시스템
- [ ] Storybook 설치
- [ ] 기본 UI 컴포넌트 완성 (Button만 완료)

#### Phase 2: Photo Mode (M2) — 대기
- [ ] FSM 구축
- [ ] Step별 UI 구현
- [ ] Azure Face API 연동
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
/app               ✅ 존재 (layout.tsx, page.tsx, globals.css)
/src/app           ✅ 존재 (README.md)
/src/entities      ✅ 존재 (README.md)
/src/features      ✅ 존재 (README.md)
/src/pages         ✅ 존재 (README.md)
/src/shared        ✅ 존재 (components/ui, lib)
/src/widgets       ✅ 존재 (README.md)
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

### 아직 설치되지 않은 필수 패키지

- [ ] `zustand` — FSM 상태 관리
- [ ] `@tanstack/react-query` — 서버 상태 관리
- [ ] `framer-motion` — 애니메이션
- [ ] `@radix-ui/*` — Shadcn 기반 컴포넌트
- [ ] `vitest` — 테스트 프레임워크
- [ ] `@testing-library/react` — 컴포넌트 테스트
- [ ] `msw` — API Mocking
- [ ] `@playwright/test` — E2E 테스트
- [ ] `@storybook/react` — UI 카탈로그
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

## 💡 Decision Log

### 2025-12-08 (22:55)
- 프로젝트 초기 구조 확인
- PLAN.md 생성 완료
- 완료 작업 체크: M1-E1 (3/5), M1-E2 (3/3), M1-E3 (3/6)
- 진행률: 6.5% (10/154 tasks)

### 2025-12-08 (23:05)
- **완료**: M1-E1-T03-1 Lefthook Git Hooks 설정
  - lefthook.yml 생성 (pre-commit, pre-push, commit-msg hooks)
  - package.json에 lefthook, test 스크립트 추가
  - Conventional Commits 규칙 적용
- 진행률: 7.1% (11/155 tasks)
- Epic 1.1 완료: 4/6 tasks
- 다음 작업: 환경 변수 구조 설계, SG.md 스타일 시스템, Storybook 설치

### 2025-12-08 (23:30)
- **완료**: M1-E1-T04, M1-E1-T05
  - M1-E1-T04: Vercel 프로젝트 생성 (사용자 배포 완료)
  - M1-E1-T05: 환경 변수 구조 설계 (.env.example 생성)
- **Epic 1.1 완료**: Repository & Environment (6/6 tasks)
- 진행률: 8.4% (13/155 tasks)
- Milestone 1 진행률: 66.7% (12/18 tasks)
- 다음 작업: SG.md 스타일 시스템, Storybook 설치, UI 컴포넌트 완성

---

## 🔄 Update Protocol

이 문서는 다음 시점에 업데이트됩니다:

1. Task 완료 시
2. 새로운 Phase 시작 시
3. 차단 요소 발생 시
4. 중요 결정 사항 발생 시

**Update Format**:
```
## [날짜] 업데이트
- 완료: [Task ID] [Task 설명]
- 진행: [Task ID] [Task 설명]
- 차단: [이슈 설명]
- 결정: [의사결정 내용]
```

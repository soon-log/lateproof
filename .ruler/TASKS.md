# LateProof — Tasks

아래 Task들은 Milestone → Epic → Task 순의 구조를 가지며,  
모든 Task는 체크박스로 추적 가능합니다.

ID 규칙:  
`M{Milestone}-E{Epic}-T{TaskNumber}`  
예: M2-E3-T04

---

# Milestone 1 — Foundation Setup

## Epic 1.1 — Repository & Environment
- [x] M1-E1-T01: GitHub Repository 생성
- [x] M1-E1-T02: README 초기 템플릿 작성
- [x] M1-E1-T03: Biome 초기 설정
- [x] M1-E1-T03-1: Lefthook Git Hooks 설정
- [x] M1-E1-T04: Vercel 프로젝트 생성
- [x] M1-E1-T05: 환경 변수 구조 설계

## Epic 1.2 — Next.js + FSD 구조
- [x] M1-E2-T01: Next.js App Router 초기화
- [x] M1-E2-T02: src/ 디렉토리 구조 생성
- [x] M1-E2-T03: FSD Layer 구축(app/features/entities/shared)

## Epic 1.3 — UI Design System & Storybook
- [x] M1-E3-T01: TailwindCSS 설치
- [x] M1-E3-T02: Shadcn 초기화
- [x] M1-E3-T03: 기본 UI 컴포넌트 작성(Button/Input/Modal 등) — Button만 완료
- [x] M1-E3-T04: SG.md 기반 스타일 시스템 구축
- [x] M1-E3-T05: Storybook 설치

## Epic 1.4 — Testing Environment Setup
- [ ] M1-E4-T01: Vitest 설치 및 설정
- [ ] M1-E4-T02: Testing Library 설치 및 setup 파일 작성
- [ ] M1-E4-T03: MSW 설치 및 핸들러 구조 생성
- [ ] M1-E4-T04: Playwright 설치 및 설정
- [ ] M1-E4-T05: package.json 테스트 스크립트 추가 및 Lefthook 통합

---

# Milestone 2 — Photo Mode Core Flow

## Epic 2.1 — FSM 구축
- [ ] M2-E1-T01: Step Enum 정의
- [ ] M2-E1-T02: Transition Table 정의
- [ ] M2-E1-T03: Zustand FSM Store 구축

## Epic 2.2 — SELECT_MODE Step
- [ ] M2-E2-T01: Photo/Map 선택 UI
- [ ] M2-E2-T02: Step 이동 처리
- [ ] M2-E2-T03: 페이지 전환 애니메이션

## Epic 2.3 — UPLOAD Step
- [ ] M2-E3-T01: 이미지 업로드(Dropzone)
- [ ] M2-E3-T02: orientation fix
- [ ] M2-E3-T03: 확대/이동 기능
- [ ] M2-E3-T04: 편집된 좌표 데이터 생성

## Epic 2.4 — MATCH Step
- [ ] M2-E4-T01: 인물 원 5개까지 생성 기능
- [ ] M2-E4-T02: 원 색상 선택
- [ ] M2-E4-T03: 표정 선택 UI
- [ ] M2-E4-T04: 좌표 Payload Builder

## Epic 2.5 — 얼굴 검증
- [ ] M2-E5-T01: Azure Face API Wrapper 작성
- [ ] M2-E5-T02: WARN → FAIL 처리
- [ ] M2-E5-T03: FAIL 시 Step 롤백
- [ ] M2-E5-T04: PASS 시 PAYMENT 이동

## Epic 2.6 — PAYMENT Step
- [ ] M2-E6-T01: Toss Payments SDK 연동
- [ ] M2-E6-T02: 결제 성공 처리
- [ ] M2-E6-T03: 결제 실패 처리

## Epic 2.7 — GENERATE Step
- [ ] M2-E7-T01: Nanobanana Payload Builder
- [ ] M2-E7-T02: 3장 생성 요청
- [ ] M2-E7-T03: 실패 시 1장 재생성 기능

## Epic 2.8 — RESULT Step
- [ ] M2-E8-T01: 3장 썸네일 렌더링
- [ ] M2-E8-T02: 이미지 확대 보기
- [ ] M2-E8-T03: 다운로드 기능
- [ ] M2-E8-T04: 단일 재생성 버튼 처리

---

# Milestone 3 — Map Mode Core Flow

## Epic 3.1 — 지도 UI
- [ ] M3-E1-T01: Google Maps JS SDK 로딩
- [ ] M3-E1-T02: 장소 검색 UI(SearchBox)
- [ ] M3-E1-T03: 좌표 기반 Reverse Geocoding
- [ ] M3-E1-T04: 장소 선택 UI

## Epic 3.2 — 프롬프트 생성
- [ ] M3-E2-T01: 장소 정보 파서
- [ ] M3-E2-T02: Nanobanana Prompt Builder

## Epic 3.3 — Flow 통합
- [ ] M3-E3-T01: Map Mode Step Flow 구성
- [ ] M3-E3-T02: MATCH → 검증 → 결제 → 생성 연결

---

# Milestone 4 — AI Generation

## Epic 4.1 — Nanobanana Integration
- [ ] M4-E1-T01: 이미지 생성 서버액션
- [ ] M4-E1-T02: Mock 응답 모델 구성
- [ ] M4-E1-T03: Payload 검증
- [ ] M4-E1-T04: 재생성 기능 분리

## Epic 4.2 — 이미지 취급
- [ ] M4-E2-T01: 업로드 이미지 메모리 처리
- [ ] M4-E2-T02: 생성 후 메모리 삭제

---

# Milestone 5 — Testing System

## Epic 5.1 — Unit Test
- [ ] M5-E1-T01: FSM Unit Test
- [ ] M5-E1-T02: 얼굴 검증 로직 Test
- [ ] M5-E1-T03: Payload builder Test
- [ ] M5-E1-T04: Orientation fix Test
- [ ] M5-E1-T05: 장소 프롬프트 Test

## Epic 5.2 — Integration Test (MSW)
- [ ] M5-E2-T01: 업로드→검증 PASS Test
- [ ] M5-E2-T02: 검증 FAIL 롤백 Test
- [ ] M5-E2-T03: 결제 흐름 Test
- [ ] M5-E2-T04: 생성 3장 처리 Test
- [ ] M5-E2-T05: 재생성 Test

## Epic 5.3 — E2E (Playwright)
- [ ] M5-E3-T01: Photo Mode Happy Path
- [ ] M5-E3-T02: Map Mode Happy Path

---

# Milestone 6 — QA / Sentry / Deployment

## Epic 6.1 — QA & UX
- [ ] M6-E1-T01: 에러 처리 Toast
- [ ] M6-E1-T02: Step 실패 UX 점검
- [ ] M6-E1-T03: 생성 실패 재시도 UX
- [ ] M6-E1-T04: 브랜드 톤 검수

## Epic 6.2 — Monitoring
- [ ] M6-E2-T01: Sentry FE 설치
- [ ] M6-E2-T02: Sentry Server Actions 설치

## Epic 6.3 — Deployment
- [ ] M6-E3-T01: Vercel 환경변수 설정
- [ ] M6-E3-T02: Custom Domain 연결
- [ ] M6-E3-T03: Production 배포

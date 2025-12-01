# LateProof — Project Plan

본 문서는 LateProof의 전체 개발 흐름을 정의한 상위 로드맵입니다.  
모든 Milestone은 순차적이지만 일부는 병렬로도 진행 가능합니다.

---

## Milestone 1 — Foundation Setup
개발 환경 구축, FSD 구조 설정, Storybook, StyleGuide, CI 토대 마련.

---

## Milestone 2 — Photo Mode Core Flow
서비스의 핵심 플로우.  
사진 업로드 → 원 매칭 → 얼굴 검증 → 결제 → 생성 → 결과  
FSM 기반으로 Step 전환을 제어합니다.

---

## Milestone 3 — Map Mode Core Flow
지도 기반 장소 선택을 통한 인증샷 생성 모드.  
Google Maps + Places API 기반.

---

## Milestone 4 — AI Generation System
Nanobanana API 통합, Payload Builder 구축, 재생성 기능 구성.

---

## Milestone 5 — Testing System
Unit + Integration + E2E(Playwright 2종)  
외부 비용 발생 API는 모두 MSW 기반 Mock 처리.

---

## Milestone 6 — QA / Monitoring / Deployment
UX 점검, Sentry 모니터링, Production 배포, 환경 변수 정리.

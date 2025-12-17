# 📝 **LateProof — Product Requirements Document (PRD) v1.2**

---

# 1. 개요

## 1.1 제품명

**LateProof**

## 1.2 목적

부모님, 연인, 친구에게 필요한 순간에 자연스럽고 진짜처럼 보이는 “즉석 인증샷 이미지”를 생성해주는 서비스.
사진 기반 또는 지도 기반으로 현실감 있는 인증샷을 3장 생성하여 다운로드 가능.

## 1.3 핵심 가치

* 난감한 순간을 **즉시 해결** (즉석 인증)
* 진짜 같은 “아이폰 촬영 톤”의 이미지 생성
* 원본 배경 100% 유지
* 게스트 기반 1회성 툴
* 데이터는 메모리 처리 후 즉시 삭제
* 저렴한 단일 과금(300~500원)

---

# 2. 타깃 사용자

| 사용자 그룹        | 니즈                   |
| ------------- | -------------------- |
| 10~30대        | 부모님/연인에게 인증 요청 받는 상황 |
| 즉흥적 약속 사용자    | 사진을 바로 찍기 어려운 상황 해결  |
| SNS·일상 인증 사용자 | 자연스러운 합성 인증샷 필요      |

---

# 3. 핵심 기능 요약

1. 모드 선택 (사진 기반 / 지도 기반)
2. 사진 업로드 또는 장소 선택
3. 최대 5명 원 매칭 + 표정 선택
4. 얼굴 품질 검증 (Azure)
5. 결제 (Toss Payments)
6. 3장 이미지 생성 (Nanobanana)
7. 실패한 1장만 재생성 가능
8. 다운로드

---

# 4. 사용자 흐름 (Flow)

```
SELECT_MODE → UPLOAD → MATCH → EXPRESSION → PAYMENT → GENERATE → RESULT
```

### Step 설명

| Step | 설명 |
|------|------|
| SELECT_MODE | 사진 기반 / 지도 기반 모드 선택 |
| UPLOAD | 베이스 이미지(배경) 업로드 |
| MATCH | 인물 마커 배치 (최대 5명), 얼굴 사진 업로드, 위치/크기/회전/얼굴 위치 조정 |
| EXPRESSION | 각 인물별 표정 선택 (이모지 기반) |
| PAYMENT | 결제 진행 (Toss Payments) |
| GENERATE | AI 이미지 생성 (3장) |
| RESULT | 결과 확인 및 다운로드 |

모든 Step 전환은 FSM(State Machine) 규칙에 따라 통제한다.

---

# 5. AI 이미지 생성 정책

## 5.1 배경 처리

* 원본 사진 배경 **100% 유지**
* AI는 인물만 생성/보정
* 조명·크기·위치는 AI 자동 조절

## 5.2 인물 처리

* 얼굴은 원본 이미지와 최대한 유사
* 표정은 사용자가 선택한 이모지 기반
* 피부톤 / 광원 자연감 우선
* 최대 5명까지 생성 가능

## 5.3 지도 기반 처리

* 위도/경도 기반
* Google Places의 지역 분위기를 반영
* “실제 장소와 비슷한 이미지” 생성 (동일 장소는 아님)

---

# 6. Step 관리 방식

* Zustand 기반 전역 상태
* Transition Table 기반 FSM
* 잘못된 Step 전환 시 차단
* 서버 액션 성공 시에만 다음 Step 이동
* Step 단위 UI 전환은 Framer Motion 적용

---

# 7. 기술 스택

## 7.1 Frontend

* Next.js (App Router)
* React 18
* TailwindCSS
* Shadcn/UI
* Framer Motion
* React Query
* Zustand(FSM)
* Storybook (UI 카탈로그)

## 7.2 Backend

* Next.js Server Actions
* Vercel Edge Functions

## 7.3 AI

* Nanobanana API (이미지 생성)
* Azure Face API (품질 검증)

## 7.4 지도

* Google Maps JS SDK
* Google Places API
* Reverse Geocoding

## 7.5 테스트

* Vitest
* React Testing Library
* MSW(Mock Service Worker)
* Playwright(E2E)

## 7.6 Dev Tools

* Biome
* TypeScript
* Sentry

## 7.7 결제

* Toss Payments

---

# 8. 아키텍처 (FSD)

```
app/
features/
entities/
shared/
(FSD — processes 제거)
```

* features = Write operations (POST/PUT/DELETE + Server Actions + 의도)
* entities = Read operations (GET + pure UI view)
* shared = lib/ui/hooks/utils/constants

---

# 9. 보안 & 정책

* 비로그인 게스트 기반
* 업로드 이미지는 메모리에만 존재 후 즉시 삭제
* 데이터 저장 없음
* 외부 AI 요청만 존재
* 결제 외 개인정보 없음

---

# 10. 비용 구조

* Nanobanana API 호출 횟수
* Azure Face API 호출
* Google Places 호출
* Vercel 사용량
* Toss Payments 수수료
* 단발성 수익(300~500원/회)

---

# 11. **QA 및 테스트 요구사항 (핵심 추가 섹션)**

LateProof는 사진 검증/결제/AI 합성 등 오류 요소가 많기 때문에
**“사용자 안전을 위한 최소 보장 + 핵심 로직 완전 테스트”**를 목표로 한다.

---

## 11.1 테스트 도구

* **Unit/Integration**: Vitest
* **Component/UI**: React Testing Library
* **API Mock**: MSW
* **E2E**: Playwright

---

## 11.2 테스트 대상 범위

### **(1) Unit Test**

* Step FSM
* 얼굴 검증 로직
* Nanobanana payload builder
* 장소 기반 프롬프트 생성
* 이미지 재생성 로직
* 파일 업로드 orientation 처리

### **(2) Integration Test**

* 업로드 → 검증 PASS 흐름
* 검증 FAIL → Step 롤백
* 결제 성공 시 Step 이동
* 3장 생성 응답 처리
* 단일 재생성 프로세스

### **(3) E2E Test (2개)**

* Photo Mode Happy Path
* Map Mode Happy Path

> 단, Azure/Nanobanana/Google/Toss 등 **비용 발생 API는 모두 Mock(MSW)**

---

## 11.3 테스트 커버리지 목표

* Unit + Integration: **50% 이상**
* Step FSM + Face 검증 + Generate 로직: **100% 필수 테스트 대상**
* E2E는 Happy Path만 존재하므로 커버리지 제외

---

# 12. **Storybook 운영 정책 (신규)**

## 12.1 목적

* Design System 검증
* 핵심 UI 카탈로그
* Style Guide 준수 여부 확인
* 개발자 스스로 UI regression 최소화

## 12.2 Storybook 범위

### 포함

* Button
* Input
* Modal
* Marker(인물 선택 원)
* 표정 선택 UI
* Dropzone
* Result Image Card
* Loading Shimmer
* Navigation / Step Indicator

### 제외

* 페이지 단위 컴포넌트
* Step 기반 Flow 스토리
* API Mock 기반 스토리
* 지도 UI 전체

## 12.3 Storybook 파일 위치

```
shared/ui/[component]/index.tsx
shared/ui/[component]/[component].stories.tsx
```

---

# 13. 스타일 가이드

(SG.md 별도 문서화 — 링크만 PRD에 명시)

* 브랜드 키워드: 은밀함 / 자연스러움
* 브랜드 문장: “엄마 저 친구랑 놀고있어요!”
* 보랏빛 미니멀 컬러 시스템
* UI/Animation/AI 스타일 정의

---

# **Appendix A — Test Scenarios**

---

## **A.1 Photo Mode Happy Path**

| Step | Action        | Input      | Expected Result  |
| ---- | ------------- | ---------- | ---------------- |
| 1    | Photo Mode 선택 | —          | Step → UPLOAD    |
| 2    | 이미지 업로드       | sample.jpg | 미리보기 표시          |
| 3    | 얼굴 위치 조정      | 원 2개       | 좌표 Mapping 완료    |
| 4    | 얼굴 검증         | Mock PASS  | Step → PAYMENT   |
| 5    | 결제            | Mock 성공    | Step → GENERATE  |
| 6    | AI 생성 요청      | Mock 3장    | Step → RESULT    |
| 7    | 결과 확인         | —          | 3장 렌더링 / 다운로드 가능 |

---

## **A.2 Map Mode Happy Path**

| Step | Action      | Input     | Expected Result |
| ---- | ----------- | --------- | --------------- |
| 1    | Map Mode 선택 | —         | 지도 표시           |
| 2    | 장소 검색       | “홍대입구”    | Mock 장소 리스트     |
| 3    | 장소 선택       | PlaceId   | 프롬프트 생성 완료      |
| 4    | 원 매칭        | 1~3개      | 좌표 지정           |
| 5    | 얼굴 검증       | Mock PASS | Step → PAYMENT  |
| 6    | 결제          | Mock 성공   | Step → GENERATE |
| 7    | AI 생성 요청    | Mock 3장   | Step → RESULT   |
| 8    | 결과 확인       | —         | 3장 Node 렌더링     |

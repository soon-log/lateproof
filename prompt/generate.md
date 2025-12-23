목표:
- 결제 연동 전에 Nano Banana Pro API 기반 이미지 생성/다운로드 플로우를 **사전 구현**한다.
- 생성 요청은 **Next.js Route Handler**에서 처리하고, 클라이언트는 결과를 받아 **미리보기 + 다운로드**할 수 있어야 한다.

배경/컨텍스트:
- Next.js App Router + FSD 구조 준수.
- MSW는 Gemini Nano Banana REST 엔드포인트를 모킹한다.
- 프롬프트 생성 로직은 **재사용 범위**에 따라 feature 또는 shared에 배치한다.

---

입력/출력 정의

입력 (클라이언트 → 서버):
- `model`: `gemini-2.5-flash-image` | `gemini-3-pro-image-preview`
- `prompt`: 텍스트 프롬프트 (필수)
- `baseImage` (선택): 베이스 이미지 파일 또는 base64
- `referenceImages` (선택): 얼굴 참조 이미지 배열 (파일 또는 base64)
- 서버는 이미지를 **base64 + mimeType**으로 변환해 `inlineData`로 구성한다
- `contents[].parts[]`는 `text` + `inlineData` 혼합으로 구성한다

이미지 입력 예시 (REST 바디 내부):
```json
{
  "contents": [
    {
      "parts": [
        { "text": "Create a picture of ..." },
        { "inlineData": { "mimeType": "image/png", "data": "<BASE64>" } }
      ]
    }
  ]
}
```

출력 (서버 → 클라이언트):
- Gemini 응답에서 `inlineData.data`(base64)와 `inlineData.mimeType`를 추출해 내부 타입으로 정규화
- 예시 내부 타입:
  - `images: [{ id, dataBase64, mimeType }]`

---

설계안 (FSD 배치)

1) Features
- `src/features/generate-image/`
  - `model/use-generate-image.ts` : 상태/요청/에러 분리 훅
  - `api/nanobanana-client.ts` : Route Handler 호출 fetcher
  - `ui/` : 입력 폼, 결과 프리뷰, 다운로드 버튼
    - `prompt-form.tsx`
    - `result-preview.tsx`
    - `generate-image-view.tsx`

2) Entities (권장)
- `src/entities/person/model/nanobanana-prompt.ts` : `buildNanobananaPrompt` (person 도메인 기반)
- `src/entities/person/model/to-nanobanana-input.ts`
  - entities 타입 → pure 입력 타입 변환

3) Feature 내부 API (권장)
- `src/features/generate-image/api/`
  - `types.ts` : 요청/응답/에러 타입 (pure)

---

배치 정책 (질문 반영)
- **generate-image 전용 로직/타입**이면 `features/generate-image` 내부로 몰아도 된다.
- **여러 feature에서 재사용**되면 `entities` 또는 `shared`로 승격한다.
- `buildNanobananaPrompt`는 **person 도메인 의존 시 entities**, 도메인 독립 시 shared에 배치한다.
- entities → pure 입력 타입 변환은 entities에서 수행한다.

권장 기본값:
- 현재 `expression-select`에서도 프롬프트 생성이 필요하므로 **entities에 유지**하는 쪽이 안전하다.

---

Nano Banana REST 적용 (문서 기준)
- 모델:
  - `gemini-2.5-flash-image` (Nano Banana)
  - `gemini-3-pro-image-preview` (Nano Banana Pro)
- 엔드포인트:
  - `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- 헤더:
  - `x-goog-api-key: <API_KEY>`
  - `Content-Type: application/json`
- 환경 변수:
  - `GEMINI_API_KEY` 사용, **요청 헤더는 `x-goog-api-key`로 전달**한다
- 요청 바디 (기본 텍스트 프롬프트):
```json
{
  "contents": [
    {
      "parts": [{ "text": "Create a picture of ..." }]
    }
  ]
}
```
- 응답 바디:
  - `candidates[0].content.parts[]` 중 `inlineData.data`(base64)로 이미지 반환
  - 클라이언트는 base64 → Blob → 미리보기/다운로드 흐름을 기본으로 한다

---

서버 사이드 (Route Handler)
- `app/api/nanobanana/generate/route.ts`
- `app/api/nanobanana/download/route.ts`
- `app/api/nanobanana/_lib/adapter.ts`
  - 외부 API → 내부 타입 변환 (Adapter 패턴)

필수 보완:
- **Gemini REST 엔드포인트**에 맞춰 요청 구성 (`generateContent`)
- 인라인 이미지 응답이므로 `next/image` remotePatterns는 **URL 렌더링 시에만** 필요
- 다운로드는 기본적으로 **클라이언트 Blob 다운로드**를 사용
  - 외부 URL 저장/호스팅을 도입하는 경우에만 프록시 다운로드 추가
- 프록시 구현 시 `response.body` 스트리밍 반환으로 메모리 부하 최소화
- 장시간 요청 대비 `export const maxDuration = 60;` 고려

---

클라이언트 UI/UX 및 상태
- `Suspense`로 로딩 위임 + `.ruler/SG.md` 로더 스타일 적용
- `react-error-boundary`로 에러 경계 구성
- 상태는 `idle | loading | success | error`로 단순화
- className 중첩 삼항 금지 → render 이전 `status` 도출 + 매핑 객체 사용

예시:
```ts
const statusConfig = {
  idle: 'bg-gray-100 text-black',
  loading: 'bg-blue-50 animate-pulse',
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200'
} as const;
```

에러 처리:
- 훅에서 `error.type = 'network' | 'api' | 'unknown'` 형태로 구분
- UI에서는 필요 시 `throw error` 방식으로 ErrorBoundary 연동

---

테스트/스토리
- `src/**/ui/*.tsx` → `*.test.tsx` + `*.stories.tsx`
- `src/**/model/*.ts` → `*.test.ts`
- `https://generativelanguage.googleapis.com/v1beta/models/*:generateContent`를 MSW로 모킹

---

보안/리스크
- API 키는 서버에서만 사용하고 클라이언트에 노출하지 않는다
- 다운로드 프록시 남용 방지: 최소한의 세션 체크 또는 서명된 URL 검증 고려
- 결제 전이라도 무단 다운로드 방지를 위한 기본 보호 필요

---

비범위
- 결제 연동 및 주문/결제 데이터 영속화
- 디자인 시스템 전면 개편

---

완료 체크리스트
- [ ] API 키가 클라이언트에 노출되지 않음
- [ ] 로딩/에러/성공 상태 검증
- [ ] 다운로드 프록시 스트리밍 확인
- [ ] 테스트/스토리 작성 완료
- [ ] `pnpm check`, `pnpm tsc`, `pnpm test`, `pnpm storybook` 통과

---
현재
```
  이미지 생성에 실패했어요: You exceeded your current quota, please check
  your plan and billing details. For more information on this error, head
  to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your
  current usage, head to: https://ai.dev/usage?tab=rate-limit. * Quota
  exceeded for metric: generativelanguage.googleapis.com/
  generate_content_free_tier_input_token_count, limit: 0, model: gemini-
  2.5-flash-preview-image * Quota exceeded for metric:
  generativelanguage.googleapis.com/generate_content_free_tier_requests,
  limit: 0, model: gemini-2.5-flash-preview-image * Quota exceeded for
  metric: generativelanguage.googleapis.com/
  generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-
  preview-image Please retry in 48.366630149s.
```
에러가 발생한다 원인을 찾고 해결하라.
---
현재 개발된 나노바나나 이미지 생성 기능은 Rest API 를 사용되어 개발되었는데 @google/genai 방식으로 리펙토링 한다.
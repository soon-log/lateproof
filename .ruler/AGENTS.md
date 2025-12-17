# AGENTS.md

항상 한글로 대답하세요.

## 문서 관리 규칙

### 코드 생성 이후 문서 업데이트
코드 생성 및 기능 개발 완료 시 다음 문서들을 반드시 업데이트하세요:

1. **.ruler/PLAN.md** — 완료된 Task 체크 및 진행 상황 수정
2. **.ruler/TASKS.md** — Task 체크박스 업데이트
3. **.ruler/ARCHITECTURE.md** — 프로젝트 구조 변경 시 업데이트

### ARCHITECTURE.md 업데이트 규칙

**업데이트가 필요한 시점**:
- 새로운 디렉토리 또는 파일 추가 시
- FSD Layer 구조 변경 시
- 아키텍처 패턴 변경 시
- 주요 기능 개발 완료 시 (Epic 단위)

**업데이트 시 준수 사항**:
- `.gitignore`에 등재된 항목은 ARCHITECTURE.md에서 제외
- 구조에 대한 명확한 설명 포함
- FSD 의존성 규칙 준수 여부 확인
- Update Protocol 형식에 따라 변경 이력 기록

**Update Format**:
```markdown
## [날짜] 업데이트
- 추가: [디렉토리/파일 경로] — [설명]
- 변경: [기존 구조] → [새 구조]
- 삭제: [디렉토리/파일 경로] — [사유]
```

## FSD 아키텍처 규칙

### Layer 구조 규칙

**일반 Layer** (pages, widgets, features, entities):
```
Layer → Slice → Segment

예시:
entities/user/model        ✅
features/auth/ui           ✅
pages/home/ui              ✅
widgets/header/ui          ✅
```

**특수 Layer** (app, shared):
```
Layer → Segment (Slice 없음!)

예시:
app/router/step-router.tsx     ✅
app/providers/query-provider.tsx  ✅
shared/ui/button.tsx       ✅
shared/lib/utils.ts        ✅

app/router/ui/step-router.tsx  ❌ (ui는 불필요한 중첩)
shared/components/ui/button.tsx  ✅ (components는 Segment)
```

**핵심 규칙**:
1. `app`과 `shared` Layer는 **Slices 없이 바로 Segments**로 구성
2. Segment 내부는 필요에 따라 추가 디렉토리 구성 가능 (예: `shared/components/ui/`)
3. Public API는 각 Slice/Segment의 최상위에 `index.ts`로 노출

### 의존성 규칙

```
app → pages → widgets → features → entities → shared
```

- 상위 Layer는 하위 Layer만 참조 가능
- 같은 Layer 간 참조 금지
- 하위 Layer는 상위 Layer 절대 참조 불가

---

## Github MCP 사용 관련 정의

- Github 저장소 위치: `soon-log/lateproof`
- Issue 생성 시 Label: `feat`, `chore`, `design`, `docs`, `fix`, `infra`, `refactor` 중 적절하게 설정

## 코드 품질 기준

- 테스트 커버리지 80% 이상 준수
- 파일당 코드의 줄 수는 500줄을 넘기지 않도록 권장

## 테스트/스토리 강제 규칙

### 대상

- `src/**/ui/*.tsx` (pages/widgets/features/entities)
- `src/shared/components/ui/*.tsx`

### 필수 산출물

1. **Unit Test 필수**: 동일 경로에 `*.test.tsx` 작성
   - 최소 요구사항: 렌더링 + 핵심 인터랙션(클릭/비활성/로딩 등) 1개 이상 검증
2. **Storybook Story 필수**: 동일 경로에 `*.stories.tsx` 작성
   - 최소 요구사항: `Default` 포함, 그리고 핵심 상태 1개 이상(예: `Selected`, `Loading`, `Disabled`, `Error`) 추가

### 예외/가이드

- `index.ts`(Public API) 파일은 테스트/스토리 대상에서 제외
- 훅/스토어 의존 UI(컨테이너 컴포넌트)는 **Story/Test를 위해 상태 주입이 가능한 형태**로 만들 것
  - 권장: `Presentational(ui)` + `Controller(model)` 분리
  - 또는: `flow`/`viewModel` 같은 **props 주입 옵션** 제공(단, React Hook 규칙을 위반하지 않도록 훅 호출은 항상 최상단에서 고정)

## UI / 로직 분리 규칙 (지속 반영)
화면 컴포넌트가 비대해지는 것을 방지하기 위해, 앞으로 모든 구현에서 UI와 로직을 분리하는 원칙을 **기본값**으로 적용합니다.

### 로직은 `model`로 이동 (Hook 중심)
- 상태/사이드이펙트/비즈니스 흐름은 훅으로 캡슐화합니다.
- 단, **하나의 훅이 여러 관심사(예: 업로드 + Step 전환 + 라우팅 + 토스트)**를 동시에 갖지 않도록, 아래 “훅 책임 분리 규칙”을 **기본값**으로 적용합니다.

### UI 컴포넌트는 “표현(Presentational)”로 유지
- UI 컴포넌트는 가능한 한 props 기반으로 렌더링만 합니다.
- 공통 버튼/헤더 등은 재사용 목적이 명확하면 `shared` 또는 `widgets`로 올립니다(FSD 의존성 규칙 준수).

### 훅 책임 분리 규칙 (모든 상황 공통)

**목표**: 훅의 책임을 “단일 관심사”로 쪼개 재사용/테스트/변경에 강하게 만든다.

1. **코어 훅 vs 오케스트레이션 훅을 분리한다**
   - **코어 훅(도메인/유틸)**: 한 가지 작업만 책임진다. 예) 파일 선택/프리뷰/업로드, 폼 상태/검증, 쿼리/뮤테이션 실행
   - **오케스트레이션 훅(Flow/Controller)**: 여러 코어 훅을 조합하고 “화면/플로우 정책”을 결정한다. 예) Step 전환, 라우팅, 토스트/트래킹, 성공/실패 분기

2. **Step 전환/라우팅/전역 스토어 연동은 원칙적으로 오케스트레이션 훅에서만 한다**
   - 코어 훅은 `useStepStore()`, `router.push()` 같은 “앱 플로우 결정” 의존성을 직접 가지지 않는다.
   - 예외가 필요하면 훅 이름/파일명에 의도를 드러낸다(예: `useUploadPhotoFlow`, `useSelectModeFlow`).

3. **결합이 필요하면 “콜백 주입”으로 느슨하게 연결한다**
   - 코어 훅은 `onSuccess/onError/onSettled` 또는 도메인에 맞는 `onUploaded` 같은 옵션을 받아, 성공/실패 “사건(event)”만 외부로 방출한다.
   - 오케스트레이션 훅이 그 이벤트를 받아 Step 전환/토스트/추적을 수행한다.

4. **훅의 반환값은 최소 API로 유지한다**
   - 반환값이 “상태 + 액션”을 넘어 커지기 시작하면(예: 액션이 6개 이상, 서로 다른 책임의 상태가 섞임) 훅 분리를 우선 검토한다.

5. **파일/네이밍 규칙으로 의도를 고정한다**
   - 코어 훅: `use-<domain>.ts` (예: `use-photo-upload.ts`)
   - 오케스트레이션 훅: `use-<domain>-flow.ts` 또는 `use-<domain>-controller.ts` (예: `use-upload-photo-flow.ts`)
   - “Flow/Controller” 훅은 해당 Feature/Page 범위의 정책을 포함할 수 있다.

## Biome Complexity 규칙 대응

`biome lint/complexity/noExcessiveCognitiveComplexity` 경고를 예방하기 위해, JSX 내부(특히 `className`)에서 **중첩 삼항 연산자** 사용을 금지합니다.

- **상태 도출(Derived State):** 복잡한 boolean 조건들은 `render` 이전에 `status`(예: `idle | active | error`) 같은 **단일 문자열 상태로 먼저 도출**합니다.
- **매핑 분리:** 스타일 로직은 `status`를 키(key)로 하는 **매핑 객체(Lookup Table)**나 `cva`의 **variants**로 위임합니다.
- **JSX 단순화:** JSX 내부에서는 `cn(base, statusMap[status])` 형태의 **단순 병합**만 수행하여 가독성을 확보합니다.
- **리소스 일원화:** 텍스트 라벨이나 아이콘 또한 `status` 기반 매핑으로 관리하여 렌더링 분기를 최소화합니다.

## 이미지 컴포넌트 규칙

- 이미지를 렌더링할 때는 기본적으로 `next/image`를 사용합니다. (`import Image from 'next/image'`)
- 예외: `blob:`/`data:` URL 기반 프리뷰처럼 최적화 파이프라인을 적용하기 어려운 경우에는 `unoptimized` 사용 또는 `<img>` 사용을 허용합니다(사유를 명확히 남기기).

### TypeScript 타입 정의 규칙

**enum 사용 지양 — as const 패턴 사용**:

```typescript
// ❌ Bad - enum 사용
enum Status {
  BANNED = 'Banned',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  ACTIVE = 'Active',
}

// ✅ Good - as const 패턴 사용
export const Status = {
  BANNED: 'Banned',
  INACTIVE: 'Inactive',
  PENDING: 'Pending',
  ACTIVE: 'Active',
} as const;

export type Status = typeof Status[keyof typeof Status];
```

## 라이브러리 관리 규칙

### Context7 사용

**라이브러리 설치 및 사용 시 Context7 필수 활용**:

라이브러리를 설치하거나 사용하기 전에 반드시 Context7 MCP를 사용하여 최신 문서와 사용법을 확인하세요.

**적용 예시**:
```typescript
// ❌ Bad - Context7 조회 없이 설치
// pnpm add zustand 후 추측으로 구현

// ✅ Good - Context7로 최신 문서 확인 후 구현
// 1. Context7로 zustand 문서 조회
// 2. 최신 API 및 Best Practice 확인
// 3. 올바른 패턴으로 구현
```

**주의사항**:
- 라이브러리 버전 변경 시 항상 Context7로 Breaking Changes 확인
- 새로운 기능 사용 시 Context7로 최신 API 문서 조회
- 에러 해결 시 Context7로 관련 문서 검색

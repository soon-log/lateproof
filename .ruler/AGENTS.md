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

## Github MCP 사용 관련 정의

- Github 저장소 위치: `soon-log/lateproof`
- Issue 생성 시 Label: `feat`, `chore`, `design`, `docs`, `fix`, `infra`, `refactor` 중 적절하게 설정

## 코드 품질 기준

- 테스트 커버리지 80% 이상 준수
- 파일당 코드의 줄 수는 500줄을 넘기지 않도록 권장

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
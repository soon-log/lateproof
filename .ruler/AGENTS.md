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

- 테스트 커버리지 90% 이상 준수
- 파일당 코드의 줄 수는 500줄을 넘기지 않도록 권장

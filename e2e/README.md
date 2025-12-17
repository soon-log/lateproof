# E2E Tests (Playwright)

## 개요

이 디렉토리는 Playwright를 사용한 E2E (End-to-End) 테스트를 포함합니다.

## 구조

```
e2e/
├── example.spec.ts       # 예제 테스트
└── README.md
```

## 실행 방법

```bash
# E2E 테스트 실행
npm run test:e2e

# UI 모드로 실행
npm run test:e2e:ui

# 특정 브라우저만 실행
npm run test:e2e -- --project=chromium
```

## 테스트 작성 계획 (Phase 5 - M5)

### Photo Mode Happy Path (M5-E3-T01)
```typescript
test('Photo Mode Happy Path', async ({ page }) => {
  // 1. SELECT_MODE
  // 2. UPLOAD
  // 3. MATCH (얼굴 위치 조정)
  // 4. PAYMENT
  // 5. GENERATE
  // 6. RESULT (다운로드)
})
```

### Map Mode Happy Path (M5-E3-T02)
```typescript
test('Map Mode Happy Path', async ({ page }) => {
  // 1. SELECT_MODE
  // 2. 장소 검색 및 선택
  // 3. MATCH (원 매칭)
  // 4. PAYMENT
  // 5. GENERATE
  // 6. RESULT
})
```

## MSW Integration

Playwright 테스트에서 외부 API는 MSW를 통해 Mock 처리됩니다.

- Azure Face API
- Nanobanana API
- Toss Payments API
- Google Maps API

## References

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

# MSW (Mock Service Worker) 구조

## 개요

이 디렉토리는 테스트 및 개발 환경에서 사용되는 MSW 핸들러를 포함합니다.

## 구조

```
src/mocks/
├── handlers/
│   └── index.ts          # 모든 API Mock 핸들러 정의
├── node.ts               # Node.js 환경 (Vitest, Playwright)
├── browser.ts            # Browser 환경 (개발 서버)
└── README.md
```

## 사용법

### Vitest에서 사용

`vitest.setup.ts`에서 자동으로 MSW server가 시작됩니다.

```typescript
import { server } from '@/mocks/node'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Playwright에서 사용

`playwright/global-setup.ts`에서 MSW server를 시작합니다.

### 개발 환경 (Browser)

필요시 `app/layout.tsx`에서 MSW worker를 시작할 수 있습니다.

```typescript
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('@/mocks/browser')
  await worker.start()
}
```

## API Mock 추가

`handlers/index.ts`에 새로운 핸들러를 추가합니다:

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/endpoint', () => {
    return HttpResponse.json({ data: 'mock' })
  }),
]
```

## References

- [MSW Documentation](https://mswjs.io)
- [MSW Node.js Integration](https://mswjs.io/docs/integrations/node)

# LateProof — Style Guide (SG.md)

> **목적**: 프로젝트 전반의 일관된 디자인 시스템 정의  
> **Last Updated**: 2025-12-09

---

## 🎨 브랜드 정체성

### 키워드
- **은밀함**: 자연스럽고 눈에 띄지 않는 UX
- **자연스러움**: 진짜 같은 AI 이미지 생성

### 브랜드 문장
> "엄마 저 친구랑 놀고있어요!"

경쾌하면서도 신뢰감을 주는 톤 유지

### 디자인 철학
- 보랏빛 미니멀 컬러 시스템
- 아이폰 촬영 톤과 유사한 자연감
- 게스트 기반 즉시 사용 가능한 단순함

---

## 🥷 Stealth UX 규칙

### 핵심 원칙
AI 기술을 전면에 노출하지 않고, 자연스러운 일상 언어로 사용자 경험을 구성한다.  
브랜드 문장 **"엄마 저 친구랑 놀고있어요!"**의 맥락에 부합하는 은밀하고 편안한 톤을 유지한다.

---

### 1. AI/합성 단어 노출 최소화

**피해야 할 표현**:
- "AI가 생성 중입니다"
- "이미지를 합성하고 있습니다"
- "인공지능이 분석 중..."
- "딥러닝 모델 처리"

**권장 표현**:
- "사진을 준비하고 있어요"
- "자연스럽게 정리 중이에요"
- "거의 다 됐어요"
- "마무리하고 있어요"

**적용 예시**:
```tsx
// ❌ Bad
<Loading>AI가 이미지를 생성 중입니다...</Loading>

// ✅ Good
<Loading>사진을 자연스럽게 정리하고 있어요</Loading>
```

---

### 2. 로딩 문구 — 상황 언어 중심

기술적 프로세스가 아닌, 사용자가 기다리는 **결과**에 초점을 맞춘다.

| Step | ❌ 기술 설명 | ✅ 상황 언어 |
|------|-----------|-----------|
| 업로드 | 파일을 업로드 중입니다 | 사진을 올리는 중이에요 |
| 얼굴 검증 | AI가 얼굴을 분석 중입니다 | 사진을 확인하고 있어요 |
| 생성 | 이미지를 합성하고 있습니다 | 거의 다 됐어요 |
| 재생성 | 재생성 요청 처리 중 | 다시 정리하고 있어요 |
| 다운로드 | 파일을 다운로드 중입니다 | 사진을 저장하고 있어요 |

**톤 규칙**:
- **~중입니다** ❌ → **~하고 있어요** ✅
- 진행률은 백분율(%) 대신 단계 표현: "1/3 완료", "거의 다 됐어요"
- 기술 오류 문구도 일상 언어로: "잠시 문제가 생겼어요. 다시 시도해주세요"

---

### 3. CTA — 일상적 표현 우선

**피해야 할 표현**:
- "AI 생성하기"
- "이미지 합성 시작"
- "처리 요청"
- "변환하기"

**권장 표현**:
- "만들기"
- "다음으로"
- "확인하기"
- "저장하기"
- "다시 해보기"

**적용 예시**:
```tsx
// ❌ Bad
<Button>AI 이미지 생성하기</Button>

// ✅ Good
<Button>만들기</Button>

// ❌ Bad
<Button>재생성 요청</Button>

// ✅ Good
<Button>다시 해보기</Button>
```

---

### 4. 결제 단계 — 강조 제한

결제는 필수 단계이지만, 과도한 강조는 사용자에게 부담을 준다.

**UI 규칙**:
- ~~빨간색 강조~~ → 브랜드 Purple 유지
- ~~"지금 결제하세요!"~~ → "확인하기"
- ~~깜빡이는 애니메이션~~ → 부드러운 fade-in
- ~~큰 폰트로 가격 강조~~ → 중립적 크기 (`text-base`, `text-lg`)

**결제 버튼 스타일**:
```tsx
// ❌ Bad - 과도한 강조
<Button 
  variant="destructive" 
  size="xl"
  className="animate-pulse"
>
  🔥 지금 바로 결제하세요!
</Button>

// ✅ Good - 자연스러운 흐름
<Button 
  variant="default" 
  size="default"
>
  확인하기
</Button>
```

**가격 표시**:
```tsx
// ❌ Bad
<div className="text-4xl font-bold text-error">
  ₩500 <span className="text-xs">단 하루만!</span>
</div>

// ✅ Good
<div className="text-lg text-neutral-700">
  ₩500
</div>
```

---

### 5. 에러/경고 메시지

기술적 오류도 일상 언어로 번역한다.

| 오류 상황 | ❌ 기술 메시지 | ✅ 일상 언어 |
|----------|-------------|-----------|
| 얼굴 검증 실패 | Face detection failed | 사진에서 얼굴을 찾을 수 없어요 |
| 파일 용량 초과 | File size exceeds 10MB | 사진 크기가 너무 커요 (10MB 이하) |
| API 오류 | 500 Internal Server Error | 잠시 문제가 생겼어요. 다시 시도해주세요 |
| 결제 실패 | Payment gateway timeout | 결제가 완료되지 않았어요 |
| 재생성 제한 | Regeneration limit reached | 재시도 횟수를 초과했어요 |

**톤 규칙**:
- 단정적 부정문(~할 수 없습니다) → 부드러운 설명(~어요)
- 에러 코드 노출 최소화
- 해결 방법을 함께 제시: "다시 시도해주세요", "다른 사진을 올려보세요"

---

### 6. UI 컴포넌트별 적용

#### 로딩 스피너
```tsx
// ❌ Bad
<Spinner>AI Processing...</Spinner>

// ✅ Good
<Spinner>잠시만 기다려주세요</Spinner>
```

#### Toast 알림
```tsx
// ❌ Bad
toast.success('Image synthesis completed successfully');

// ✅ Good
toast.success('사진이 준비됐어요');
```

#### 단계 표시
```tsx
// ❌ Bad
<Steps>
  <Step>Upload</Step>
  <Step>AI Processing</Step>
  <Step>Result</Step>
</Steps>

// ✅ Good
<Steps>
  <Step>사진 올리기</Step>
  <Step>확인하기</Step>
  <Step>완료</Step>
</Steps>
```

---

### 7. 카피라이팅 원칙

**DO**:
- 2인칭 존댓말 사용 (~해주세요, ~하시겠어요?)
- 짧고 명확한 문장
- 긍정적 어조 유지
- 행동 유도는 부드럽게

**DON'T**:
- 기술 용어 남발
- AI/합성/알고리즘 등 단어 노출
- 과장된 표현 ("세계 최고", "혁신적")
- 압박감 조성 ("지금 바로", "서두르세요")

---

### 8. 접근성과의 균형

Stealth UX는 스크린 리더 사용자에게도 명확해야 한다.

```tsx
// ✅ Good - aria-label은 명확하게
<button aria-label="사진 생성하기">
  만들기
</button>

// ✅ Good - Loading 상태 명확히
<div role="status" aria-live="polite">
  사진을 준비하고 있어요
</div>
```

---

## 🎯 Stealth UX 체크리스트

프로덕션 배포 전 확인:

- [ ] 모든 로딩 메시지에서 "AI", "합성", "생성" 제거
- [ ] CTA 버튼 텍스트 일상 언어로 변경
- [ ] 결제 화면 과도한 강조 제거
- [ ] 에러 메시지 일상 언어로 번역
- [ ] Toast 알림 톤 점검
- [ ] Step Indicator 라벨 확인
- [ ] 스크린 리더 테스트 (aria-label 명확성)

---

## 🌈 색상 팔레트

### Primary (Purple — 브랜드 메인)

```css
--color-brand-50: #faf5ff    /* 배경 강조, hover 상태 */
--color-brand-100: #f3e8ff   /* 서브 배경 */
--color-brand-200: #e9d5ff   /* 비활성 상태 */
--color-brand-500: #a855f7   /* 메인 브랜드 컬러 */
--color-brand-600: #9333ea   /* hover/active 상태 */
--color-brand-700: #7e22ce   /* 강조 텍스트 */
--color-brand-900: #581c87   /* 헤딩, 강한 강조 */
```

**사용 예시**:
- Primary Button: `bg-brand-500 hover:bg-brand-600`
- 링크: `text-brand-700 hover:text-brand-600`
- 배경 강조: `bg-brand-50`

---

### Neutral (Gray — 텍스트/UI 기반)

```css
--color-neutral-50: #fafafa   /* 카드 배경 */
--color-neutral-100: #f5f5f5  /* 입력 필드 배경 */
--color-neutral-200: #e5e5e5  /* 구분선 */
--color-neutral-400: #a3a3a3  /* 비활성 텍스트 */
--color-neutral-500: #737373  /* 보조 텍스트 */
--color-neutral-700: #404040  /* 서브 헤딩 */
--color-neutral-900: #171717  /* 주 텍스트 */
```

**사용 예시**:
- 주 텍스트: `text-neutral-900`
- 보조 텍스트: `text-neutral-500`
- Border: `border-neutral-200`

---

### Accent (Violet/Indigo — 인터랙티브 요소)

```css
--color-accent-400: #a78bfa  /* Focus ring, 선택 상태 */
--color-accent-500: #8b5cf6  /* Interactive hover */
--color-indigo-500: #6366f1  /* 링크, CTA 버튼 보조 */
```

**사용 예시**:
- Focus ring: `ring-accent-400`
- Interactive hover: `hover:bg-accent-500`

---

### Semantic (상태 피드백)

```css
--color-success: #22c55e   /* 성공, 완료 */
--color-warning: #f59e0b   /* 경고, 주의 */
--color-error: #ef4444     /* 오류, 실패 */
--color-info: #3b82f6      /* 정보, 안내 */
```

**사용 예시**:
- 성공 Toast: `bg-success text-white`
- 오류 메시지: `text-error`

---

## 📐 타이포그래피

### Font Family

```css
--font-sans: system-ui, -apple-system, "Pretendard", "Apple SD Gothic Neo", sans-serif;
--font-mono: "SF Mono", Menlo, Monaco, Consolas, monospace;
```

- **본문**: `font-sans` 사용
- **코드/데이터**: `font-mono` 사용

---

### Font Size

| 토큰 | 크기 (rem) | 크기 (px) | 용도 |
|------|-----------|----------|------|
| `xs` | 0.75rem | 12px | Caption, 라벨 |
| `sm` | 0.875rem | 14px | 보조 텍스트 |
| `base` | 1rem | 16px | 본문 |
| `lg` | 1.125rem | 18px | 부제목 |
| `xl` | 1.25rem | 20px | 소제목 |
| `2xl` | 1.5rem | 24px | 섹션 제목 |
| `3xl` | 1.875rem | 30px | 페이지 제목 |
| `4xl` | 2.25rem | 36px | Hero 제목 |

---

### Font Weight

| 토큰 | 값 | 용도 |
|------|-----|------|
| `regular` | 400 | 본문 |
| `medium` | 500 | 강조 텍스트 |
| `semibold` | 600 | 버튼, 라벨 |
| `bold` | 700 | 헤딩 |

---

### Line Height

| 토큰 | 값 | 용도 |
|------|-----|------|
| `tight` | 1.25 | 헤딩 |
| `normal` | 1.5 | 본문 |
| `relaxed` | 1.75 | 긴 텍스트 |

---

### Typography Presets

```css
/* Heading 1 */
.heading-1 {
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-neutral-900);
}

/* Heading 2 */
.heading-2 {
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-neutral-900);
}

/* Body Large */
.body-lg {
  font-size: 1.125rem; /* 18px */
  line-height: 1.75;
  color: var(--color-neutral-700);
}

/* Body Regular */
.body {
  font-size: 1rem; /* 16px */
  line-height: 1.5;
  color: var(--color-neutral-900);
}

/* Body Small */
.body-sm {
  font-size: 0.875rem; /* 14px */
  line-height: 1.5;
  color: var(--color-neutral-700);
}

/* Caption */
.caption {
  font-size: 0.75rem; /* 12px */
  color: var(--color-neutral-500);
}
```

---

## 📏 Spacing System

**8px 기반 시스템** 사용

| 토큰 | 값 (rem) | 값 (px) | 용도 |
|------|---------|---------|------|
| `0.5` | 0.125rem | 2px | 아이콘 간격 |
| `1` | 0.25rem | 4px | 미세 간격 |
| `2` | 0.5rem | 8px | 최소 간격 |
| `3` | 0.75rem | 12px | 작은 간격 |
| `4` | 1rem | 16px | 기본 간격 |
| `5` | 1.25rem | 20px | 중간 간격 |
| `6` | 1.5rem | 24px | 섹션 내 간격 |
| `8` | 2rem | 32px | 큰 간격 |
| `10` | 2.5rem | 40px | 섹션 간격 |
| `12` | 3rem | 48px | 페이지 여백 |
| `16` | 4rem | 64px | 큰 페이지 여백 |
| `20` | 5rem | 80px | Hero 섹션 여백 |

---

## 📱 Breakpoints

```css
/* Mobile First 방식 */
sm: 640px   /* 작은 태블릿 */
md: 768px   /* 태블릿 */
lg: 1024px  /* 데스크탑 */
xl: 1280px  /* 큰 데스크탑 */
2xl: 1536px /* 와이드 스크린 */
```

**사용 예시**:
```html
<div class="px-4 md:px-8 lg:px-12">
  <!-- 모바일: 16px, 태블릿: 32px, 데스크탑: 48px -->
</div>
```

---

## 🎯 Border Radius

```css
--radius-sm: 0.375rem  /* 6px - 작은 요소 */
--radius-md: 0.5rem    /* 8px - 기본 */
--radius-lg: 0.625rem  /* 10px - 카드, 버튼 */
--radius-xl: 0.75rem   /* 12px - 모달 */
--radius-2xl: 1rem     /* 16px - Hero 요소 */
--radius-full: 9999px  /* 완전한 원형 */
```

**사용 예시**:
- Button: `rounded-lg` (10px)
- Card: `rounded-lg` (10px)
- Modal: `rounded-xl` (12px)
- Avatar: `rounded-full`

---

## 🎭 Shadow System

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

**사용 예시**:
- Card: `shadow-md`
- Modal: `shadow-xl`
- Dropdown: `shadow-lg`
- Button hover: `shadow-lg`

---

## ⚡ Animation & Transition

### Duration

```css
--duration-fast: 150ms    /* 마이크로 인터랙션 */
--duration-base: 200ms    /* 기본 전환 */
--duration-slow: 300ms    /* 부드러운 전환 */
--duration-slower: 500ms  /* 페이지 전환 */
```

### Easing

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

**사용 예시**:
```css
.button {
  transition: background-color var(--duration-base) var(--ease-out);
}
```

---

## 🔘 Component Guidelines

### Button Variants

**Primary**
```tsx
<button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
  시작하기
</button>
```

**Secondary**
```tsx
<button className="bg-brand-100 hover:bg-brand-200 text-brand-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
  자세히 보기
</button>
```

**Ghost**
```tsx
<button className="hover:bg-brand-50 text-brand-700 px-4 py-2 rounded-lg transition-colors duration-200">
  건너뛰기
</button>
```

---

### Input Fields

```tsx
<input 
  type="text" 
  className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-200"
  placeholder="이름을 입력하세요"
/>
```

---

### Cards

```tsx
<div className="bg-white p-6 rounded-lg shadow-md border border-neutral-200 hover:shadow-lg transition-shadow duration-200">
  {/* Card Content */}
</div>
```

---

## 🎨 AI 이미지 스타일 가이드

### 배경 처리
- 원본 배경 100% 유지
- 조명 자동 조절
- 자연스러운 그림자 생성

### 인물 처리
- 아이폰 촬영 톤 모방
- 피부톤 자연감 우선
- 표정은 이모지 기반 선택
- 최대 5명까지 생성 가능

### 프롬프트 키워드
```
natural lighting, iPhone photography style, realistic skin tone, 
candid moment, soft shadows, authentic atmosphere
```

---

## 📋 Accessibility

### Focus States
- 모든 인터랙티브 요소에 `focus:ring-2 focus:ring-accent-400` 적용
- Tab navigation 완전 지원

### Color Contrast
- 텍스트 대비율 최소 4.5:1 (WCAG AA 기준)
- 주 텍스트: `text-neutral-900` on `bg-white`
- 보조 텍스트: `text-neutral-500` on `bg-white`

### Screen Reader
- 중요 이미지에 `alt` 속성 필수
- Interactive 요소에 `aria-label` 제공
- Form 입력 필드에 `<label>` 연결

---

## 🚀 Usage in Code

### Tailwind Class Example

```tsx
// Primary Button
<button className="bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
  생성하기
</button>

// Card with hover effect
<div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-neutral-200">
  <h3 className="text-2xl font-bold text-neutral-900 mb-2">제목</h3>
  <p className="text-neutral-500">설명 텍스트</p>
</div>

// Typography
<h1 className="text-4xl font-bold text-neutral-900 leading-tight">
  LateProof
</h1>
<p className="text-lg text-neutral-700 leading-relaxed">
  즉석 인증샷 생성 서비스
</p>
```

---

## ✅ Acceptance Criteria Checklist

- [x] SG.md 파일 생성 완료
- [x] Tailwind config에 커스텀 토큰 반영 (@theme 블록)
- [x] 색상 변수 정의 완료 (Brand Purple, Neutral, Accent, Semantic)
- [x] 폰트 시스템 정의 완료 (Font Family, Size, Weight, Line Height)
- [x] 간격 시스템 정의 완료 (8px 기반 Spacing)
- [x] Button 컴포넌트에 스타일 적용 (브랜드 Purple 색상)
- [ ] Storybook에서 스타일 검증 (다음 Task: M1-E3-T05)

---

## 📚 References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [OKLCH Color Space](https://oklch.com)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

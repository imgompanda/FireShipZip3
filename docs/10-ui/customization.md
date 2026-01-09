# UI 커스터마이징 가이드

이 프로젝트는 **Tailwind CSS**와 **Shadcn/UI**를 기반으로 스타일링되어 있습니다.
색상, 폰트, 컴포넌트 스타일을 쉽게 변경하는 방법을 안내합니다.

## 1. 색상 테마 변경

`src/app/globals.css` 파일에서 CSS 변수를 수정하여 전체 테마 색상을 변경할 수 있습니다.

```css
@layer base {
  :root {
    /* 메인 색상 (Primary) */
    --primary: 240 5.9% 10%; /* HSL 값 */
    --primary-foreground: 0 0% 98%;

    /* 포인트 색상 (Accent) */
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
  }

  /* 다크 모드 색상 */
  .dark {
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
  }
}
```

> **팁**: [UI Colors](https://uicolors.app) 같은 사이트에서 HSL 값을 복사해서 붙여넣으면 편리합니다.

## 2. 폰트 변경

`src/app/[locale]/layout.tsx`에서 구글 폰트를 변경할 수 있습니다.

```tsx
import { Inter } from "next/font/google"; // 1. 원하는 폰트 임포트

const inter = Inter({ subsets: ["latin"] }); // 2. 폰트 설정

// 3. body 클래스에 적용
<body className={inter.className}>
```

## 3. UI 컴포넌트 커스터마이징

### 쿠키 동의 배너 (Cookie Consent)

- 파일: `src/components/ui/cookie-consent.tsx`
- **스타일 수정**: `div` 태그의 Tailwind 클래스를 수정하세요 (예: `bg-white` -> `bg-blue-50`).
- **위치 수정**: `bottom-0`을 `top-0`으로 바꾸면 상단 배너가 됩니다.

### 피드백 위젯 (Feedback Widget)

- 파일: `src/components/ui/feedback-widget.tsx`
- **아이콘 변경**: `MessageSquareIcon`을 다른 아이콘으로 교체하세요.
- **색상 변경**: `Button`의 `variant`를 변경하거나 `className`을 수정하세요.

## 4. 새 컴포넌트 추가

Shadcn/UI 라이브러리의 컴포넌트를 추가하려면 공식 문서를 참고하거나 CLI를 사용하세요:

```bash
npx shadcn-ui@latest add [컴포넌트이름]
# 예: npx shadcn-ui@latest add dialog
```

# 애니메이션 UI 컴포넌트

이 프로젝트에는 사용자 경험을 향상시키기 위한 고성능 애니메이션 컴포넌트들이 포함되어 있습니다. 모든 애니메이션은 `GSAP`와 `Framer Motion`, CSS 커스텀 애니메이션을 활용하여 부드럽고 자연스럽게 동작합니다,

## 1. AnimatedHero

메인 랜딩 페이지의 최상단에 위치하는 컴포넌트입니다. GSAP를 활용한 텍스트 등장 효과와 3D 이미지 부유 효과를 제공합니다.

### 사용법

```tsx
import { AnimatedHero } from "@/components/ui/animated/AnimatedHero";

export default function Page() {
  return (
    <AnimatedHero
      badge="새로운 기능"
      title1="미래를 만드는"
      title2Prefix="가장 빠른"
      title2Highlight="솔루션"
      description="복잡한 설정 없이 바로 시작하세요."
      primaryCta={{
        text: "시작하기",
        href: "/login",
      }}
      secondaryCta={{
        text: "더 알아보기",
        href: "#features",
      }}
      // imageSrc="/path/to/image.png" // 생략 시 기본 추상 그래픽 표시
      className="bg-background"
    />
  );
}
```

### Props

| Prop              | Type             | Description                        |
| ----------------- | ---------------- | ---------------------------------- |
| `badge`           | `string`         | 상단 배지 텍스트 (옵션)            |
| `title1`          | `string`         | 메인 제목 첫 줄                    |
| `title2Prefix`    | `string`         | 메인 제목 두 번째 줄 앞부분 (옵션) |
| `title2Highlight` | `string`         | 강조된 제목 (Primary 색상 및 배경) |
| `description`     | `string`         | 설명 텍스트                        |
| `primaryCta`      | `{ text, href }` | 주요 행동 유도 버튼                |
| `secondaryCta`    | `{ text, href }` | 보조 버튼 (옵션)                   |
| `imageSrc`        | `string`         | 우측 이미지 경로 (옵션)            |
| `className`       | `string`         | 추가 스타일 클래스                 |

---

## 2. BentoGrid

애플 스타일의 격자형 레이아웃을 제공하는 컴포넌트입니다. 기능 소개나 포트폴리오 갤러리 등에 적합합니다.

### 사용법

```tsx
import { BentoGrid, BentoGridItem } from "@/components/ui/animated/BentoGrid";
import { Zap, Globe } from "lucide-react";

export function Features() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      <BentoGridItem
        title="글로벌 배포"
        description="전 세계 어디서든 빠른 속도를 경험하세요."
        header={<div className="bg-blue-100 min-h-[6rem] rounded-xl" />}
        icon={<Globe className="h-4 w-4" />}
        className="md:col-span-2"
      />
      <BentoGridItem
        title="빠른 속도"
        description="최적화된 성능을 보장합니다."
        header={<div className="bg-yellow-100 min-h-[6rem] rounded-xl" />}
        icon={<Zap className="h-4 w-4" />}
        className="md:col-span-1"
      />
    </BentoGrid>
  );
}
```

---

## 3. FeatureCard (Holographic)

마우스 움직임에 따라 은은한 빛이 따라다니는 홀로그래픽 효과 카드를 구현합니다.

### 사용법

```tsx
import { FeatureCard } from "@/components/ui/animated/FeatureCard";
import { Database } from "lucide-react";

export function Cards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FeatureCard
        title="데이터베이스"
        description="Supabase와 완벽하게 통합됩니다."
        icon={<Database className="h-6 w-6 text-green-500" />}
      />
      {/* ... */}
    </div>
  );
}
```

### 특징

- **Spotlight Effect**: 마우스 커서를 따라다니는 그라디언트 조명 효과
- **Glassmorphism**: 투명도와 블러 효과를 활용한 현대적인 디자인

---

## 4. ScrollAnimation

> ⚠️ **현재 상태**: 안정성 문제로 인해 애니메이션 로직이 비활성화되었습니다. 컴포넌트는 단순 래퍼(`<div>`)로 동작하며, 자식 요소를 그대로 렌더링합니다. 향후 업데이트에서 안정화된 버전을 제공할 예정입니다.

요소가 화면에 스크롤되어 들어올 때 애니메이션을 트리거하는 래퍼 컴포넌트입니다.

### 사용법

```tsx
import { ScrollAnimation } from "@/components/ui/animated/ScrollAnimation";

export function Section() {
  return (
    <ScrollAnimation animation="slide-up" delay={0.2} duration={0.8}>
      <h1>부드럽게 등장하는 제목</h1>
    </ScrollAnimation>
  );
}
```

### Props

| Prop        | Type     | Default      | Description                                                                      |
| ----------- | -------- | ------------ | -------------------------------------------------------------------------------- |
| `animation` | `string` | `"slide-up"` | 애니메이션 종류 (`fade-in`, `slide-up`, `scale-up`, `slide-right`, `slide-left`) |
| `duration`  | `number` | `0.6`        | 애니메이션 지속 시간 (초)                                                        |
| `delay`     | `number` | `0`          | 애니메이션 시작 지연 시간 (초)                                                   |
| `className` | `string` | -            | 추가 클래스                                                                      |

---

## 5. ParallaxBackground

> ⚠️ **현재 상태**: 랜딩 페이지에서 제거되었습니다. Z-index 충돌 및 다른 컴포넌트 가시성 문제로 인해 비활성화되었습니다. 독립적으로 사용할 경우, 아래 가이드를 참고하세요.

스크롤에 반응하여 배경 요소들이 서로 다른 속도로 움직이는 심도 효과를 제공합니다. `GSAP ScrollTrigger`를 사용합니다.

### 사용법

```tsx
import { ParallaxBackground } from "@/components/ui/animated/ParallaxBackground";

export default function Page() {
  return (
    <div>
      <ParallaxBackground />
      {/* Page Content... */}
    </div>
  );
}
```

### 주의사항

- `ParallaxBackground`는 `position: fixed`와 `z-index: 0`을 사용합니다.
- 메인 컨텐츠는 반드시 `relative z-10` 이상으로 설정해야 배경 위에 표시됩니다.
- 다른 컴포넌트와 Z-index 충돌이 발생할 수 있으므로 신중하게 사용하세요.

---

## 6. TypewriterText

텍스트가 타자기로 치는 것처럼 한 글자씩 나타나고 지워지는 효과를 줍니다.

### 사용법

```tsx
import { TypewriterText } from "@/components/ui/animated/TypewriterText";

<TypewriterText
  texts={["Designer", "Developer", "Creator"]}
  typingSpeed={100}
  deletingSpeed={50}
  pauseDuration={2000}
  className="text-primary font-bold"
/>;
```

---

## ⚠️ Troubleshooting & Common Errors

### Hydration Mismatch (Server/Client Mismatch)

**Error Message:**

```text
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
This won't be patched up. This can happen if a SSR-ed Client Component used:
- Variable input such as Date.now() or Math.random() which changes each time it's called.
```

**Cause:**
Animations that rely on random values (like star positions in `ParallaxBackground`) must generate these values **deterministically** or **client-side only**. If `Math.random()` runs on the server (SSR) and then again on the client, the values will differ, causing React to throw a hydration error.

**Solution:**
Move random value generation inside `useEffect` so it only runs on the client after mounting.

```tsx
// ❌ WRONG (Causes Error)
// The random value is generated during render, which differs between Server and Client
const stars = generateBoxShadowStars(100);

// ✅ CORRECT (Safe)
const [stars, setStars] = useState("");
useEffect(() => {
  // Only generate after component mounts on the client
  setStars(generateBoxShadowStars(100));
}, []);
```

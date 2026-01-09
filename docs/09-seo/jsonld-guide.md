# 🏷️ JSON-LD 구조화 데이터 가이드

검색 결과에서 **리치 스니펫**으로 더 눈에 띄게 보이게 해주는 설정이에요.

---

## 🤔 JSON-LD가 뭔가요?

검색 엔진에게 **"이 사이트는 이런 종류야"**라고 알려주는 구조화된 데이터예요.

### 적용 전

```
My SaaS - 팀 협업 도구
https://mysaas.com
팀과 함께 일하세요...
```

### 적용 후 (리치 스니펫)

```
⭐⭐⭐⭐⭐ 4.8 (200 reviews)
🏢 My SaaS - 팀 협업 도구
https://mysaas.com
무료 체험 가능 | 팀과 함께 일하세요...
```

---

## 📁 관련 파일

| 파일                               | 역할                                 |
| ---------------------------------- | ------------------------------------ |
| `src/app/[locale]/layout.tsx`      | 전역 JSON-LD (WebSite, Organization) |
| `src/components/shared/JsonLd.tsx` | 재사용 가능한 JSON-LD 컴포넌트       |

---

## ⚙️ 이미 설정되어 있어요!

이 보일러플레이트에는 기본 JSON-LD가 설정되어 있어요:

### 현재 포함된 스키마

- **WebSite**: 사이트 기본 정보
- **Organization**: 회사/브랜드 정보

---

## 🔧 커스터마이징 하기

### layout.tsx에서 수정하기

`src/app/[locale]/layout.tsx`의 `<head>` 부분을 수정하세요:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "내 서비스 이름", // 변경
      url: "https://my-domain.com", // 변경
      logo: "https://my-domain.com/logo.png", // 변경
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@my-domain.com", // 변경
        contactType: "customer service",
      },
    }),
  }}
/>
```

### 블로그 포스트에 Article 스키마 추가하기

```tsx
import { ArticleJsonLd } from "@/components/shared/JsonLd";

export default function BlogPost({ post }) {
  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        publishedTime={post.date}
        author="FreAiner"
        url={`https://my-domain.com/blog/${post.slug}`}
      />
      {/* 포스트 내용 */}
    </>
  );
}
```

---

## 📋 자주 쓰는 스키마 타입

| 타입                  | 용도             |
| --------------------- | ---------------- |
| `WebSite`             | 사이트 기본 정보 |
| `Organization`        | 회사/브랜드 정보 |
| `SoftwareApplication` | SaaS 앱 정보     |
| `Article`             | 블로그 포스트    |
| `FAQPage`             | FAQ 페이지       |
| `Product`             | 상품 (요금제)    |

---

## 🧪 테스트하기

1. [Google Rich Results Test](https://search.google.com/test/rich-results) 접속
2. 사이트 URL 입력
3. 구조화 데이터가 잘 인식되는지 확인

---

## 💡 AI한테 시키기

새로운 스키마가 필요하면 AI에게 요청하세요:

```
src/app/[locale]/layout.tsx에 SoftwareApplication 스키마를 추가해줘.
앱 이름은 "TaskFlow", 카테고리는 "BusinessApplication",
가격은 "무료 체험 가능"으로 설정해줘.
```

---

**이제 검색 결과에서 더 눈에 띄게 보일 거예요! ⭐**

# 🗺️ Sitemap & robots.txt 가이드

검색 엔진이 사이트를 잘 크롤링할 수 있도록 도와주는 설정이에요.

---

## 📁 관련 파일

| 파일                 | 역할               | URL            |
| -------------------- | ------------------ | -------------- |
| `src/app/sitemap.ts` | 사이트맵 자동 생성 | `/sitemap.xml` |
| `src/app/robots.ts`  | 크롤링 규칙 설정   | `/robots.txt`  |

---

## 🤔 왜 필요한가요?

### Sitemap

검색 엔진에게 **"내 사이트에 이런 페이지들이 있어"**라고 알려주는 파일이에요.

- Google이 더 빨리 색인해요
- 새 페이지가 추가되면 자동으로 반영돼요
- 블로그 포스트도 자동으로 포함돼요

### robots.txt

검색 엔진에게 **"여기는 크롤링해도 되고, 여기는 안 돼"**라고 알려주는 파일이에요.

- 대시보드, 어드민 페이지는 검색에 안 나오게
- API 엔드포인트도 크롤링 제외

---

## ⚙️ 이미 설정되어 있어요!

이 보일러플레이트에는 이미 sitemap과 robots.txt가 설정되어 있어요.

### 현재 포함된 페이지들

```typescript
// src/app/sitemap.ts
const staticPages = [
  { path: "", priority: 1.0 }, // 홈
  { path: "/pricing", priority: 0.9 }, // 요금제
  { path: "/blog", priority: 0.8 }, // 블로그
  { path: "/terms", priority: 0.3 }, // 이용약관
  { path: "/privacy", priority: 0.3 }, // 개인정보처리방침
];
```

### 자동으로 추가되는 것들

- **다국어 페이지**: `/en/...`, `/ko/...` 모두 포함
- **블로그 포스트**: `content/blog/`의 모든 MDX 파일

---

## 🔧 커스터마이징 하기

### 새 페이지 추가하기

`src/app/sitemap.ts` 파일을 수정하세요:

```typescript
const staticPages = [
  // 기존 페이지들...
  { path: "/about", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/features", priority: 0.8, changeFreq: "weekly" as const },
];
```

### 크롤링 제외 경로 추가하기

`src/app/robots.ts` 파일을 수정하세요:

```typescript
disallow: ["/dashboard/", "/admin/", "/api/", "/my-secret-page/"],
```

---

## 🧪 확인하기

개발 서버에서 직접 확인할 수 있어요:

- **Sitemap**: http://localhost:3000/sitemap.xml
- **robots.txt**: http://localhost:3000/robots.txt

---

## ✅ 배포 후 체크리스트

- [ ] `NEXT_PUBLIC_APP_URL` 환경변수가 실제 도메인으로 설정되어 있나요?
- [ ] Google Search Console에 사이트맵 제출했나요?
- [ ] `https://your-domain.com/sitemap.xml` 접속 확인

---

## 🔗 Google Search Console에 사이트맵 제출하기

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 사이트 등록 (도메인 소유권 확인)
3. 좌측 메뉴 → **Sitemaps**
4. `https://your-domain.com/sitemap.xml` 입력
5. **Submit** 클릭

제출 후 며칠 내로 Google이 색인하기 시작해요!

---

**이제 검색엔진이 사이트를 잘 찾을 수 있어요! 🔍**

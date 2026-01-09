# 🤖 SEO 자동 생성 프롬프트

> 이 프롬프트를 AI(Cursor, Claude 등)에 입력하면 SEO 메타데이터를 자동으로 생성하고 적용할 수 있어요.

---

## 📁 수정해야 할 파일

| 파일                          | 역할                                     |
| ----------------------------- | ---------------------------------------- |
| `src/app/[locale]/layout.tsx` | 메인 메타데이터 (title, description, OG) |
| `messages/ko.json`            | 한국어 SEO 텍스트                        |
| `messages/en.json`            | 영어 SEO 텍스트                          |
| `public/og-image.png`         | SNS 공유 이미지 (1200x630px)             |
| `public/favicon.ico`          | 브라우저 탭 아이콘                       |

---

## 🚀 AI에게 바로 시키기 (원클릭)

아래 프롬프트를 복사해서 AI에게 붙여넣기만 하세요:

```
현재 프로젝트를 파악해서 이 프로젝트의 SEO를 설정해줘

## 해야 할 작업
1. `src/app/[locale]/layout.tsx`의 metadata 수정
2. `messages/ko.json`과 `messages/en.json`에 SEO 관련 텍스트 추가
3. 모든 title, description 한글/영어 모두 작성

```

---

## 📝 세부 프롬프트들

### 1. 메타데이터만 생성

```
당신은 SEO 전문가입니다. 현재 프로젝트를 분석하고 그 정보를 바탕으로 웹사이트의 SEO 메타데이터를 생성해주세요.

## 출력 요청
1. **title** (60자 이내, 한글/영어 각각)
2. **description** (155자 이내, 한글/영어 각각)
3. **keywords** (10개, 쉼표 구분)
4. **Open Graph title** (60자 이내)
5. **Open Graph description** (100자 이내)

출력은 JSON 형식으로 해주세요.
```

### 예시 출력

```json
{
  "title": {
    "ko": "TaskFlow - 팀 협업의 새로운 기준",
    "en": "TaskFlow - Redefine Team Collaboration"
  },
  "description": {
    "ko": "칸반 보드, 일정 관리, 팀 채팅을 하나로. TaskFlow와 함께 팀 생산성을 높이세요.",
    "en": "Kanban boards, scheduling, team chat in one place. Boost your team's productivity."
  },
  "keywords": ["프로젝트 관리", "팀 협업", "칸반", "SaaS", "productivity"]
}
```

---

### 2. layout.tsx에 바로 적용하기

```
현재 프로젝트를 파악하고 `src/app/[locale]/layout.tsx`의 metadata를 수정해줘.

metadata 객체 전체를 수정해서 보여줘.
openGraph, twitter, icons 모두 포함해줘.
```

---

### 3. OG 이미지 생성 (DALL-E/Midjourney용)

```
Create a professional Open Graph image for a SaaS product.

Service name: [서비스 이름]
Tagline: [한 줄 설명]
Brand colors: [메인 컬러 헥스코드]

Requirements:
- Dimensions: 1200x630 pixels
- Style: Modern, minimal, tech aesthetic
- Include the service name in bold, clean typography
- Add a short tagline below the name
- Use gradient or solid background matching brand colors
- No device mockups or photos of people
- Ensure text is readable and centered

Output should look premium and trustworthy.
```

---

### 4. 페이지별 메타데이터 생성

```
당신은 SEO 전문가입니다. 현재 프로젝트를 분석해 해당 SaaS 서비스의 각 페이지에 맞는 메타데이터를 생성해주세요.

## 서비스 정보
- 서비스 이름: [서비스 이름]
- 서비스 설명: [간단한 설명]

## 페이지 목록
1. 홈페이지 (/)
2. 요금제 (/pricing)
3. 블로그 (/blog)
4. 로그인 (/login)

각 페이지에 대해 다음을 생성해주세요:
- title (60자 이내)
- description (155자 이내)

한글과 영어 모두 제공해주세요.
```

---

## ✅ 적용 후 체크리스트

- [ ] `layout.tsx`에 metadata 수정했나요?
- [ ] OG 이미지를 `public/og-image.png`에 저장했나요?
- [ ] 카카오톡/슬랙에 링크 공유해서 미리보기 테스트했나요?
- [ ] Google Search Console에 사이트 등록했나요?

---

## 🔗 관련 문서

- [SEO 설정 가이드](./README.md)
- [법적 문서 프롬프트](../07-ai-customization/legal-prompts.md)

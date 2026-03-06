# 프리미엄 UI/UX 디자인 리디자인 계획서 (For Claude Code)

이 문서는 `@fireshipzip3` 오픈소스 SaaS 스타터킷의 디자인을 "심각하게 구린" 상태에서 세계적인 수준의 "프리미엄(Premium)" 퀄리티로 끌어올리기 위한 구체적인 가이드이자 작업 계획입니다. 사용자는 이 문서를 바탕으로 Claude Code에게 디자인 개선 작업을 지시할 수 있습니다.

## 🎨 1. 핵심 디자인 철학 및 미학 가이드 (Aesthetics Rules)

오픈소스로 배포되어 많은 사람들이 "와, 이거 디자인 미쳤다"고 느낄 수 있도록 다음의 프리미엄 디자인 규칙을 모든 컴포넌트에 엄격하게 적용합니다.

1. **상태(Flat)보다는 공간감(Depth)과 반투명(Glassmorphism)**:
   - 단순한 단색 배경(bg-base-100 등)을 피하고, 어두운 배경 위에 `bg-white/5 backdrop-blur-xl` 또는 `bg-black/40 backdrop-blur-2xl`을 사용하여 유리 같은 질감을 부여합니다.
   - 컨테이너나 카드 컴포넌트에 미세한 내부 테두리(`border border-white/10`)를 적용해 고급스러운 빛 반사 느낌을 줍니다.
2. **우아한 마이크로 애니메이션 (Framer Motion 활용)**:
   - 사용자의 마우스가 올라가는(Hover) 모든 요소는 즉각적이면서도 부드럽게 반응해야 합니다. (`transition-all duration-300 ease-out`)
   - 카드를 호버할 때 은은한 색상의 빛 번짐 효과(`hover:shadow-[0_0_30px_rgba(var(--primary),0.15)]`)와 아주 살짝 떠오르는 효과(`hover:-translate-y-1`)를 공통 적용합니다.
3. **타이포그래피의 대비와 여백**:
   - 제목(Heading)은 자간을 좁게(`tracking-tight`) 설정하여 볼드하고 임팩트 있게 구성합니다. (예: `text-5xl md:text-7xl font-extrabold tracking-tighter`)
   - 본문 텍스트는 색상 대비를 낮춰 눈을 편안하게 합니다. (`text-base-content/70` 또는 `text-neutral-400`).
4. **단조로운 색상 탈피 (Gradients & Glows)**:
   - 일반적인 원색(빨강, 파랑 등) 대신, `hsl` 기반의 세련된 브랜드 컬러를 정의합니다. (예: Electric Indigo, Neon Teal 등).
   - 텍스트 그라데이션을 적극 활용합니다. (`bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`)

---

## 🏗️ 2. 페이지별 세부 디자인 개편 계획

### 📍 A. 랜딩 페이지 (`src/app/[locale]/page.tsx`)

**1. Hero 섹션 (`AnimatedHero.tsx` 개선)**

- **[현재 문제]**: 평범한 타이포그래피와 투박한 레이아웃.
- **[개선 방향]**:
  - 화면 중앙에 거대한 텍스트가 배치되는 구도로 변경. 텍스트 뒤에 은은하게 퍼지는 오로라 브러시 노이즈(Aurora/Mesh Gradient) 배경 추가.
  - CTA(Call to Action) 버튼은 단순한 둥근 버튼이 아니라, 테두리를 따라 빛이 흐르는 애니메이션(Shimmer Border) 효과 적용.

**2. 벤토 그리드 특징 섹션 (`BentoGrid.tsx`)**

- **[현재 문제]**: 배경색과 아이콘만 있는 밋밋한 카드.
- **[개선 방향]**:
  - Apple 스타일의 프리미엄 벤토(Bento) 레이아웃 적용.
  - 각 그리드 아이템은 `bg-neutral/40 border border-white/5` 기반에, 마우스 호버 시 그라데이션 빛막(Glow) 효과가 커서를 따라다니는 방향성 호버 효과(Spotlight effect) 구현.

**3. 로고 클라우드 (Customer Logos)**

- **[현재 문제]**: 고정된 레이아웃에 흐린 회색 텍스트 배치.
- **[개선 방향]**:
  - `framer-motion`을 사용하여 로고들이 자연스럽게 무한 롤링(Infinite Marquee Scrolling) 되도록 변경. 양옆에 그라데이션 마스크를 추가해 로고가 스르륵 나타나고 사라지도록 처리.

**4. 요금제 섹션 (Pricing)**

- **[개선 방향]**:
  - 'Pro' 또는 '인기' 요금제 카드는 외곽선이 빛나는 애니메이션(Animated Gradient Border) 래퍼를 씌워 시각적으로 완벽히 분리.
  - 배경은 가장 어둡게, 텍스트는 순백색으로 강렬한 대비 처리.

**5. 홀로그래픽 특징 카드 섹션 (FeatureCard)**

- **[개선 방향]**:
  - 진정한 '홀로그래픽' 느낌이 나도록 카드 호버 시 카드에 기울기가 생기는(3D Tilt) 효과(GSAP 또는 React-use-gesture 활용) 적용.

---

### 📍 B. 대시보드 및 내부 페이지 (`src/app/[locale]/(dashboard)/*`)

- **사이드바 내비게이션**:
  - 화면 전체 높이를 차지하는 투박한 솔리드 컬러 사이드바 대신, 화면 왼쪽 가장자리에서 약간 띄워진 '플로팅 사이드바(Floating Glass Sidebar)' 디자인 채택.
- **대시보드 메인 레이아웃**:
  - 데이터 위젯/카드들은 모서리가 둥근(`rounded-2xl`~`rounded-3xl`) 부드러운 형태 유지. 여백(Padding)을 현재보다 1.5배 늘려 시원한 공간감을 줌.
  - 데이터 차트(Recharts 등) 영역의 색상을 단색에서 부드러운 그라데이션 라인으로 교체.

---

### 📍 C. 인증 페이지 (`src/app/[locale]/(auth)/*`)

- **로그인/회원가입 폼**:
  - 기존 중앙 집중형 폼을 **스플릿 화면(Split Screen)** 디자인으로 변경 (좌/우 분할).
  - 한쪽 면은 아름다운 추상적 3D 렌더링 이미지나 감각적인 패턴(또는 애니메이션)을 풀 스크린으로 배치하여 프로젝트의 퀄리티를 과시. 다른 한쪽 면은 미니멀하고 깨끗한 글래스모피즘 입력 폼 구성.

---

### 📍 D. 블로그 및 문서 페이지 (`blog`, `docs`)

- **읽기 경험(Readability) 극대화**:
  - 노션(Notion)이나 리니어(Linear)의 업데이트 로그 페이지 등 최신 트렌드를 반영.
  - 본문 폭을 `max-w-prose`(또는 `max-w-3xl`)로 제한.
  - 코드 블록(`kbd`, `pre`)은 테두리가 얇고 둥근 어두운 컨테이너에 담고, Mac 스타일의 3색 창 컨트롤 버튼 모형을 살짝 추가해 개발자 친화적인 디테일을 더함.

---

## 🤖 Claude Code 운영 지침 및 실행 프로세스 (사용자용 실행 팁)

### ✅ 구현 체크리스트 (Claude Code가 따라야 할 순서)

- [ ] 1. 전역 스타일 및 상수 디자인 토큰 업데이트 (`globals.css`, `tailwind.config` / `postcss`)
- [ ] 2. `AnimatedHero.tsx` 리팩토링 (Spotlight / Gradient Text 적용)
- [ ] 3. `BentoGrid.tsx` 리팩토링 (Glassmorphism & Hover Glow 적용)
- [ ] 4. Logo Cloud 무한 스크롤 컴포넌트 신규 분리 및 적용
- [ ] 5. Pricing, Testimonial 디자인 고급화
- [ ] 6. 대시보드 플로팅 사이드바 레이아웃 적용
- [ ] 7. Auth 분할 스크린 뷰 개선

---

## 🖼️ 3. 시각적 디자인 레퍼런스 (Visual Design References)

이 문서와 함께 전달된 시각적 디자인 레퍼런스(`premium_saas_landing_page_mockup_1772772827082.png`)를 참고하여 비슷한 심미적인 분위기를 구현해야 합니다.

- **글래스모피즘 벤토 섹션 및 은은한 백그라운드 그라데이션**이 적용되어야 합니다.

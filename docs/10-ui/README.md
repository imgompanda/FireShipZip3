# UI 컴포넌트 가이드

FireShip에는 **27개의 기본 UI 컴포넌트**와 **다양한 기능별 컴포넌트**가 포함되어 있습니다. 모두 **shadcn/ui** 기반으로 제작되어 쉽게 커스터마이징할 수 있습니다.

---

## 기본 UI 컴포넌트 (`/components/ui/`)

| 컴포넌트            | 파일명                | 설명                        |
| ------------------- | --------------------- | --------------------------- |
| **Accordion**       | `accordion.tsx`       | 접고 펼치는 아코디언 UI     |
| **Alert Dialog**    | `alert-dialog.tsx`    | 확인/취소 팝업 다이얼로그   |
| **Alert**           | `alert.tsx`           | 알림 메시지 박스            |
| **Avatar**          | `avatar.tsx`          | 프로필 아바타 이미지        |
| **Badge**           | `badge.tsx`           | 태그/뱃지 (상태 표시)       |
| **Button**          | `button.tsx`          | 버튼 (다양한 variant 지원)  |
| **Card**            | `card.tsx`            | 카드 레이아웃               |
| **Checkbox**        | `checkbox.tsx`        | 체크박스                    |
| **Cookie Consent**  | `cookie-consent.tsx`  | 쿠키 동의 배너              |
| **Dialog**          | `dialog.tsx`          | 모달 다이얼로그             |
| **Dropdown Menu**   | `dropdown-menu.tsx`   | 드롭다운 메뉴               |
| **Feedback Widget** | `feedback-widget.tsx` | 피드백 수집 위젯            |
| **Form**            | `form.tsx`            | 폼 (react-hook-form 통합)   |
| **Input**           | `input.tsx`           | 텍스트 입력 필드            |
| **Label**           | `label.tsx`           | 폼 라벨                     |
| **Popover**         | `popover.tsx`         | 팝오버                      |
| **Scroll Area**     | `scroll-area.tsx`     | 커스텀 스크롤 영역          |
| **Select**          | `select.tsx`          | 셀렉트 드롭다운             |
| **Separator**       | `separator.tsx`       | 구분선                      |
| **Sheet**           | `sheet.tsx`           | 사이드 시트 (슬라이드 패널) |
| **Sidebar**         | `sidebar.tsx`         | 사이드바 네비게이션         |
| **Skeleton**        | `skeleton.tsx`        | 로딩 스켈레톤               |
| **Sonner**          | `sonner.tsx`          | 토스트 알림                 |
| **Table**           | `table.tsx`           | 테이블                      |
| **Tabs**            | `tabs.tsx`            | 탭 네비게이션               |
| **Textarea**        | `textarea.tsx`        | 멀티라인 텍스트 입력        |
| **Tooltip**         | `tooltip.tsx`         | 툴팁                        |

---

## 공유 컴포넌트 (`/components/shared/`)

| 컴포넌트          | 파일명              | 설명                        |
| ----------------- | ------------------- | --------------------------- |
| **Header**        | `Header.tsx`        | 글로벌 헤더/네비게이션      |
| **Footer**        | `Footer.tsx`        | 글로벌 푸터                 |
| **ClientWidgets** | `ClientWidgets.tsx` | 클라이언트 위젯 로더        |
| **JsonLd**        | `JsonLd.tsx`        | SEO용 구조화 데이터         |
| **ThemeProvider** | `ThemeProvider.tsx` | 다크/라이트 테마 프로바이더 |
| **ThemeToggle**   | `ThemeToggle.tsx`   | 테마 전환 버튼              |

---

## 기능별 컴포넌트

### 💳 구독 관리 (`/components/features/subscription/`)

| 컴포넌트           | 파일명                         | 설명                                  |
| ------------------ | ------------------------------ | ------------------------------------- |
| **Cancel Button**  | `CancelSubscriptionButton.tsx` | 구독 취소 버튼 (확인 다이얼로그 포함) |
| **Billing Button** | `ManageBillingButton.tsx`      | 결제 관리 버튼 (LemonSqueezy 연동)    |
| **Failed Banner**  | `PaymentFailedBanner.tsx`      | 결제 실패 알림 배너                   |

### 🎫 고객 지원 (`/components/features/support/`)

| 컴포넌트          | 파일명                   | 설명                   |
| ----------------- | ------------------------ | ---------------------- |
| **Ticket Form**   | `SupportTicketForm.tsx`  | 고객 지원 티켓 생성 폼 |
| **Ticket List**   | `UserTicketList.tsx`     | 사용자 티켓 목록       |
| **Admin Detail**  | `AdminTicketDetail.tsx`  | 관리자용 티켓 상세 뷰  |
| **Status Select** | `TicketStatusSelect.tsx` | 티켓 상태 변경 셀렉트  |

---

## 관리자 컴포넌트 (`/components/admin/`)

| 컴포넌트             | 파일명                | 설명                           |
| -------------------- | --------------------- | ------------------------------ |
| **Admin Chart**      | `AdminChart.tsx`      | 매출/구독 차트 (Recharts 기반) |
| **Admin Filter**     | `AdminFilter.tsx`     | 데이터 필터 UI                 |
| **Admin Pagination** | `AdminPagination.tsx` | 페이지네이션                   |
| **Admin Search**     | `AdminSearch.tsx`     | 검색 UI                        |

---

## 이메일 템플릿 (`/components/emails/`)

| 컴포넌트           | 파일명                   | 설명                       |
| ------------------ | ------------------------ | -------------------------- |
| **Welcome Email**  | `WelcomeEmail.tsx`       | 환영 이메일 (가입/구매 시) |
| **Payment Failed** | `PaymentFailedEmail.tsx` | 결제 실패 알림 이메일      |

---

## 컴포넌트 사용 예시

### Button 사용

```tsx
import { Button } from "@/components/ui/button";

// 기본 버튼
<Button>클릭</Button>

// Variant 적용
<Button variant="outline">아웃라인</Button>
<Button variant="ghost">고스트</Button>
<Button variant="destructive">삭제</Button>

// 크기 조절
<Button size="sm">작은 버튼</Button>
<Button size="lg">큰 버튼</Button>
```

### Card 사용

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
  </CardHeader>
  <CardContent>카드 내용이 여기에 들어갑니다.</CardContent>
</Card>;
```

### Dialog (모달) 사용

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>모달 열기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>모달 제목</DialogTitle>
    </DialogHeader>
    <p>모달 내용입니다.</p>
  </DialogContent>
</Dialog>;
```

---

## 새 컴포넌트 추가하기

shadcn/ui 라이브러리에서 추가 컴포넌트를 설치할 수 있습니다:

```bash
npx shadcn-ui@latest add [컴포넌트이름]

# 예시
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
```

> 💡 **팁**: [shadcn/ui 공식 문서](https://ui.shadcn.com/docs/components)에서 사용 가능한 모든 컴포넌트를 확인하세요.

---

## 다음 단계

- [UI 커스터마이징 가이드](./customization.md) - 색상, 폰트, 테마 변경 방법

# 고객 지원 시스템 (Customer Support System)

사용자가 문의 사항을 접수하고 관리자가 이를 효율적으로 관리할 수 있는 내장 티켓 시스템이에요.

## 🚀 주요 기능 (Features)

### 👤 사용자용 (User Side)

- **간편한 문의 접수**: `/support` 페이지에서 이메일, 제목, 카테고리, 내용을 입력하여 문의할 수 있어요.
- **자동 이메일 입력**: 로그인한 사용자의 경우 이메일 주소가 자동으로 채워져 편리해요.
- **카테고리 선택**: 결제, 계정, 기술 지원, 기타 등 문의 유형을 선택할 수 있어요.
- **실시간 피드백**: 문의 접수 성공 시 토스트 메시지로 즉시 알려드려요.

### 🛡️ 어드민용 (Admin Side)

- **목록 통합 조회**: `/admin/tickets`에서 모든 문의 내역을 한눈에 확인해요.
- **검색 및 필터링 (New!)**:
  - **검색**: 사용자 이메일이나 제목 키워드로 특정 티켓을 빠르게 찾을 수 있어요.
  - **필터**: 처리 상태(`Open`, `In Progress`, `Resolved`, `Closed`) 및 카테고리별로 모아볼 수 있어요.
- **페이지네이션 (New!)**: 많은 티켓도 10개씩 끊어보며 쾌적하게 관리해요.
- **상태 관리**: 드롭다운 메뉴를 통해 티켓의 진행 상태를 실시간으로 업데이트할 수 있어요.
- **다국어 지원**: 한국어와 영어 모두 완벽하게 지원해요.

## 🛠️ 기술 사양 (Implementation Details)

- **데이터베이스**: Supabase `support_tickets` 테이블 (RLS 정책 적용됨)
- **폼 처리**: React Hook Form + Zod (유효성 검사)
- **UI 컴포넌트**: Shadcn UI (Table, Select, Badge, Toast)
- **서버 액션**: Next.js Server Actions를 통한 안전한 데이터 처리

## 📖 사용 방법 (How to Use)

1.  **사용자 문의 접수**:
    - `/support` 페이지로 이동해요.
    - 양신을 작성하고 "보내기(Submit)" 버튼을 클릭해요.
2.  **문의 답변 및 관리**:
    - `/admin/tickets` 페이지로 이동해요. (어드민 권한 필요)
    - 상단 검색창과 필터를 활용해 티켓을 검토해요.
    - "Status" 열의 버튼을 눌러 상태를 변경하면 실시간으로 저장돼요.

---

## 🌎 Internationalization (i18n)

- **Korean**: `messages/ko.json` 내 `Support`, `Admin.tickets` 섹션 참조
- **English**: `messages/en.json` 내 `Support`, `Admin.tickets` 섹션 참조

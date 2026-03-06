# 플랜: FireShipZip3 전체 점검 수정

- 생성일시: 2026-03-06 13:30
- 상태: 진행중
- 워크스트림 수: 3

## 전체 목표
코드 리뷰 + UX 분석에서 발견된 CRITICAL/HIGH 이슈 전체 수정

## 워크스트림

### WS-1: 보안/API 수정 (CRITICAL + HIGH)
- crypto.timingSafeEqual 버퍼 길이 체크
- AI Chat API 인증 추가
- 피드백 API 인증 추가
- 데모 모드 보안 강화 (환경변수 제어)
- Pricing fallback Variant ID 제거
- Toss 웹훅 서명 검증 강화
- ADMIN_EMAILS trim 불일치 수정
- debug/email 페이지 인증 추가

### WS-2: 코드 품질 + i18n
- @ts-nocheck 제거 및 타입 수정 (5개 파일)
- console.log 디버그 문 제거
- 하드코딩 영어 텍스트 i18n 처리 (~20개소)
- .env.local.example에 AI 키 섹션 추가
- check-env.js 필수/선택 분리
- ContactForm sessionId 버그 수정

### WS-3: DaisyUI 마이그레이션 잔여 (24개 파일)
- dashboard/page.tsx
- settings/page.tsx
- subscription/page.tsx
- admin 페이지들
- 기타 zinc/dark 패턴 잔여 파일들

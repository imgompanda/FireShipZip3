# 🤖 법적 문서 생성 프롬프트

> 이 프롬프트를 AI에게 입력하면 이용약관과 개인정보처리방침을 자동 생성하고 적용할 수 있어요.

---

## 📁 수정해야 할 파일

| 파일                                            | 역할                    |
| ----------------------------------------------- | ----------------------- |
| `src/app/[locale]/(marketing)/terms/page.tsx`   | 이용약관 페이지         |
| `src/app/[locale]/(marketing)/privacy/page.tsx` | 개인정보처리방침 페이지 |
| `messages/ko.json` → `Legal`                    | 한국어 법적 텍스트      |
| `messages/en.json` → `Legal`                    | 영어 법적 텍스트        |

---

## 🚀 AI에게 바로 시키기 (원클릭)

아래 프롬프트를 복사해서 AI에게 붙여넣기만 하세요:

```
아래 정보로 이 프로젝트의 법적 문서(이용약관, 개인정보처리방침)를 업데이트해줘.

## 내 서비스 정보
- 서비스 이름: [예: TaskFlow]
- 회사/개인명: [예: FreAiner]
- 이메일: [예: support@taskflow.com]
- 사업장 위치: [예: 대한민국 서울]
- 사용하는 외부 서비스: Supabase, LemonSqueezy, Resend

## 해야 할 작업
1. `messages/ko.json`의 `Legal` 섹션 업데이트
2. `messages/en.json`의 `Legal` 섹션 업데이트
3. 한국법(개인정보보호법, 전자상거래법) 및 글로벌(GDPR) 모두 고려

토스체로 친근하게 설명해줘.
```

---

## 📝 세부 프롬프트들

### 1. 이용약관 생성 (한국어)

```
당신은 한국의 IT 전문 변호사입니다. "[서비스이름]" 서비스를 위한 **이용약관**을 작성해 주세요.

## 서비스 정보
- 서비스 이름: [서비스이름]
- 서비스 유형: [예: SaaS 구독 서비스]
- 운영자: [회사/개인명]
- 이메일: [이메일]

## 적용 법률
- 전자상거래 등에서의 소비자보호에 관한 법률 (청약철회 등)
- 약관의 규제에 관한 법률

## 주요 내용
1. 서비스 이용 계약 체결
2. 구독 취소 및 환불 규정 (법적 의무 사항 반영)
3. 회사의 면책 조항 (단, 고의/중과실 제외)
4. 저작권 및 이용 라이선스
5. 재판 관할: 서울중앙지방법원

마크다운 형식으로 출력해주세요.
```

### 2. 이용약관 생성 (영어)

```
Act as an international IT lawyer. Write a **Terms of Service** for a SaaS product called "[Service Name]".

## Service Info
- Service Name: [Service Name]
- Company: [Company Name]
- Email: [Email]
- Jurisdiction: [e.g., Republic of Korea]

## Key Clauses
1. Subscription & Cancellation policy
2. Acceptable Use Policy (AUP)
3. Limitation of Liability (standard "As Is" clauses)
4. Governing Law: Republic of Korea
5. Dispute Resolution: Seoul Central District Court

Output in markdown format.
```

---

### 3. 개인정보처리방침 생성 (한국어)

```
당신은 한국 개인정보보호법(PIPA) 전문가입니다. **개인정보처리방침**을 작성해 주세요.

## 서비스 정보
- 서비스 이름: [서비스이름]
- 개인정보보호책임자: [이름]
- 이메일: [이메일]

## 사용하는 외부 서비스 (국외 이전 포함)
- Supabase (미국, 데이터베이스)
- LemonSqueezy (미국, 결제 처리)
- Resend (미국, 이메일 발송)

## 필수 고지 사항 (법적 의무)
1. 개인정보 처리 목적 및 보유 기간
2. 제3자 제공 현황
3. **국외 이전**: 해외 서버 위탁 내용 포함 (국가, 이전 일시, 방법)
4. 정보주체의 권리 행사 방법
5. 파기 절차 및 방법
6. 개인정보 보호책임자 (CPO) 연락처

마크다운 형식으로 출력해주세요.
```

### 4. 개인정보처리방침 생성 (영어 - GDPR)

```
Act as a GDPR and CCPA privacy expert. Write a **Privacy Policy** for "[Service Name]".

## Service Info
- Data Controller: [Company Name]
- Contact: [Email]

## Processors (Third Parties)
- Supabase (Database, USA)
- LemonSqueezy (Payments, USA)
- Resend (Email, USA)

## Key Sections (GDPR Compliant)
1. Types of data collected (PII, Usage Data)
2. Purpose of processing
3. Data Retention policy
4. International Data Transfers (Standard Contractual Clauses)
5. User Rights (Access, Deletion, Portability - GDPR Art. 15-20)
6. Cookie Policy reference
7. Contact information

Output in markdown format.
```

---

## ✅ 적용 후 체크리스트

- [ ] `messages/ko.json`의 `Legal` 섹션 업데이트했나요?
- [ ] `messages/en.json`의 `Legal` 섹션 업데이트했나요?
- [ ] `/ko/terms`, `/ko/privacy` 페이지에서 내용 확인했나요?
- [ ] `/en/terms`, `/en/privacy` 페이지에서 내용 확인했나요?
- [ ] Footer에 약관/개인정보처리방침 링크가 있나요?

---

## ⚠️ 주의사항

> [!WARNING]
> AI가 생성한 법적 문서는 **참고용**입니다.
> 실제 서비스 운영 전에 **전문 변호사의 검토**를 받으세요.

---

## 🔗 관련 문서

- [SEO 프롬프트](./seo-prompts.md)
- [AI 커스터마이징 가이드](./README.md)

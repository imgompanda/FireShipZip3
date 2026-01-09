# 04. LemonSqueezy: 결제 설정

LemonSqueezy를 연동하여 **구독 결제**를 처리할 수 있어요.

> 💡 LemonSqueezy는 **Merchant of Record** 서비스예요.
> 세금, 부가세 처리를 대신해주기 때문에 **한국 사업자도 쉽게 글로벌 결제**를 받을 수 있어요!

---

## ⚠️ 시작하기 전에 꼭 읽어주세요!

### 1. 테스트 모드로 진행하세요

개발 중에는 **반드시 Test Mode를 활성화**하세요.

1. Dashboard 좌측 하단 → **Test Mode** 토글 활성화
2. 테스트 모드에서는 실제 결제가 발생하지 않아요
3. 테스트 카드: `4242 4242 4242 4242`

### 2. 스토어 승인은 미리 신청하세요

LemonSqueezy는 **스토어 승인 심사**가 있어요.

- 승인까지 **1~5일 정도 소요**될 수 있어요
- 개발을 시작하면서 **미리 승인 신청**을 해두세요
- Settings → Store details → 필요한 정보 입력 후 승인 요청

> 💡 **팁**: 승인 대기 중에도 Test Mode로 개발을 계속할 수 있어요!

---

## 1단계: 계정 생성 및 스토어 설정

1. [LemonSqueezy](https://lemonsqueezy.com)에 가입하세요
2. **Store** 생성 (이미 있으면 건너뛰기)
3. 판매자 정보 입력
4. **스토어 승인 신청** (Settings → Store details)

---

## 2단계: 상품 및 가격 생성

1. Dashboard → **Products** → **New Product** 클릭
2. 상품 정보 입력:
   - **Name**: Basic Plan / Pro Plan
   - **Pricing**: Subscription (구독)
   - **Price**: 월 가격 설정
3. **Save** 후 **Variant ID** 복사

> ⚠️ 각 가격의 **Variant ID**를 복사해두세요. 환경변수에 필요해요!

---

## 3단계: API 키 생성

1. Dashboard → **Settings** → **API** 클릭
2. **Create API Key** 버튼 클릭
3. 키 복사 후 안전하게 저장

`.env.local`에 추가:

```bash
LEMONSQUEEZY_API_KEY=lmsq_xxxxxxxxxxxxx
```

---

## 4단계: Store ID 확인

1. Dashboard → **Settings** → **Stores** 클릭
2. **Store ID** (숫자) 복사

`.env.local`에 추가:

```bash
LEMONSQUEEZY_STORE_ID=12345
```

---

## 5단계: 파일 설명

| 파일명            | 설명                                    |
| :---------------- | :-------------------------------------- |
| `actions.ts`      | Checkout URL 생성, 구독 취소/변경 등    |
| `plans.ts`        | **Variant ID 기반 플랜 가격/기능 설정** |
| `webhook-test.md` | Webhook 테스트 가이드                   |

---

## 6단계: 플랜 설정 (자동 연동!)

`src/lib/lemon/plans.ts` 파일은 **환경변수에서 Variant ID를 자동으로 읽어옵니다.**

✅ **`.env.local`에 Variant ID만 입력하면 끝!**

```bash
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC=123456
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=123457
```

> 💡 **`plans.ts` 파일 수정이 필요한 경우**:
>
> - 플랜 이름, 가격 표시, 기능 목록을 변경하고 싶을 때만
> - 예: `$9/month` → `$19/month`로 표시 변경

---

## Webhook 설정

Webhook은 결제 완료, 구독 변경 등의 이벤트를 앱에 알려주는 역할이에요.

> 🎯 **권장 순서**
>
> 1. **먼저 Vercel에 배포** → 실제 URL로 Webhook 설정 (가장 간단!)
> 2. 배포 전 로컬 테스트가 필요하면 → ngrok 사용 (선택사항)

---

### ✅ 권장: 배포 후 설정하기

**가장 간단한 방법!** Vercel에 먼저 배포하고 Webhook을 설정하세요.

1. 먼저 Vercel에 배포 ([02-deployment](../02-deployment/) 참고)
2. 배포된 URL 확인 (예: `https://myapp.vercel.app`)
3. 아래 "LemonSqueezy에서 Webhook 생성" 단계로 이동

> 💡 **왜 이 방법이 좋나요?**
>
> - ngrok 설치/설정이 필요 없음
> - URL이 고정되어 매번 업데이트 안 해도 됨
> - 실제 운영 환경과 동일하게 테스트 가능

---

### 🔧 고급: 로컬에서 테스트하기 (ngrok)

> ⚠️ **선택사항**: 배포 전에 로컬에서 Webhook을 테스트해야 할 때만 사용하세요.

로컬에서 웹훅을 테스트하려면 외부에서 접근 가능한 URL이 필요해요.

**ngrok 설치 및 실행**:

```bash
# Mac (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# Windows (Scoop)
scoop install ngrok

# 또는 설치 없이 바로 실행 (모든 OS)
npx ngrok http 3000
```

**실행 후 출력 예시**:

```
Forwarding https://abc123.ngrok.io -> http://localhost:3000
```

`https://abc123.ngrok.io`를 복사하세요.

> ⚠️ **주의**: ngrok 무료 버전은 **재시작마다 URL이 바뀌어요**.
> 테스트할 때마다 LemonSqueezy에서 URL을 업데이트해야 해요.

---

### Option C: 자체 서버가 있는 경우

AWS, GCP, 또는 자체 VPS를 사용 중이라면:

1. 서버에 앱 배포
2. 도메인 연결 (예: `api.yourdomain.com`)
3. HTTPS 인증서 설정 (Let's Encrypt 등)
4. Webhook URL: `https://api.yourdomain.com/api/webhooks/lemon`

> 💡 **팁**: Nginx나 Caddy로 리버스 프록시 설정하면 HTTPS 자동 갱신이 됩니다.

### LemonSqueezy에서 Webhook 생성

1. Dashboard → **Settings** → **Webhooks** 클릭
2. **New Webhook** 버튼 클릭
3. 정보 입력:
   - **URL**:
     - 로컬: `https://abc123.ngrok.io/api/webhooks/lemon`
     - 배포 후: `https://yourapp.vercel.app/api/webhooks/lemon`
   - **Signing secret**: 안전한 비밀키 입력 (예: `whsec_my_super_secret_123`)
4. **Events** 선택:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_payment_success`
   - `subscription_payment_failed`
   - `subscription_paused`
   - `subscription_unpaused`
5. **Save** 클릭

`.env.local`에 추가:

```bash
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_my_super_secret_123
```

> 💡 **팁**: Vercel 배포 후에는 Vercel 환경변수에도 추가하세요!

---

## 6단계: Variant ID 환경변수 추가

```bash
# 각 플랜의 Variant ID
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC=123456
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=123457
```

---

## 7단계: 테스트하기

3. 테스트 카드 정보:
   - **카드 번호**: `4242 4242 4242 4242`
   - **만료일**: 미래 날짜
   - **CVC**: 아무 3자리

> 💡 **결제창 방식 가이드**
>
> 이 보일러플레이트는 가장 안정적인 **풀페이지 리다이렉트(Hosted Checkout)** 방식을 기본으로 사용해요.
>
> - **장점**: 브라우저 보안 정책이나 광고 차단기(AdBlock)의 영향을 받지 않아 결제 성공률이 가장 높아요.
> - **팁**: 버튼을 눌렀을 때 `loading` 상태를 보여주면 사용자가 더 안심하고 기다릴 수 있어요. (현재 `pricing/page.tsx`에 구현됨)

---

## 📁 전체 환경변수 예시

```bash
# LemonSqueezy
LEMONSQUEEZY_API_KEY=lmsq_xxxxxxxxxxxxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxxxx

# 플랜 Variant IDs (클라이언트에서 사용 가능해야 함)
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC=123456
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO=123457
```

---

## 💡 AI로 LemonSqueezy 기능 확장하기

### 새 플랜 추가

```
LEMONSQUEEZY_VARIANT_ENTERPRISE 환경변수를 추가하고,
src/services/lemon/actions.ts를 수정해서
Enterprise 플랜 체크아웃을 지원해줘.
```

### 일시정지 기능 추가

```
src/services/lemon/actions.ts에
pauseSubscription과 resumeSubscription 함수를 추가해줘.
LemonSqueezy updateSubscription API를 사용하면 돼.
```

---

## 💬 문제 해결

### Webhook이 작동하지 않아요

→ URL이 정확한지 확인하고, ngrok을 사용 중이라면 URL이 바뀌지 않았는지 확인하세요.

### 결제 후 구독이 생성되지 않아요

→ Webhook Secret이 정확한지 확인하세요. 콘솔에서 "Invalid signature" 에러가 있는지 확인하세요.

### 구독 취소 테스트가 이상해요

→ **Test Mode**에서는 구독 취소 시 `ends_at`이 즉시 현재 시각으로 설정되어 바로 `canceled` 상태가 될 수 있어요.
→ 실제 운영 환경(Production)에서는 `cancel_at_period_end`가 `true`가 되고, 남은 기간 동안은 `active` 상태가 유지됩니다.

---

**다음**: [05-resend](../05-resend/) - 이메일 설정하기

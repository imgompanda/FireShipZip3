# Webhook 테스트 가이드

LemonSqueezy 웹훅을 테스트하는 방법이에요. 개발 환경과 배포 환경에 따라 방법이 달라요.

---

## 🌍 환경별 테스트 방법

| 환경          | 방법            | 설명                             |
| ------------- | --------------- | -------------------------------- |
| **로컬 개발** | ngrok 사용      | 로컬 서버를 임시 공인 URL로 노출 |
| **배포 후**   | Vercel URL 사용 | 실제 배포된 URL로 바로 테스트    |

---

## 🔧 로컬 개발 환경 (ngrok 사용)

로컬(`localhost:3000`)은 외부에서 접근할 수 없어요. **ngrok**을 사용해서 임시 공인 URL을 만들어야 해요.

### 1단계: ngrok 설치

```bash
# macOS (Homebrew)
brew install ngrok

# Windows (Chocolatey)
choco install ngrok

# 또는 직접 다운로드
# https://ngrok.com/download
```

### 2단계: ngrok 계정 생성 (무료)

1. [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup) 접속
2. Google 또는 GitHub으로 가입 (30초 컷!)

### 3단계: Authtoken 설정

1. [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) 접속
2. **Your Authtoken** 복사
3. 터미널에서 실행:

```bash
ngrok config add-authtoken 여기에_복사한_토큰_붙여넣기
```

### 4단계: 터널 시작

```bash
# 로컬 서버가 3000 포트에서 실행 중이어야 해요
ngrok http 3000
```

실행하면 이런 화면이 나와요:

```
Forwarding   https://abcd-1234.ngrok-free.app -> http://localhost:3000
```

**`https://abcd-1234.ngrok-free.app`** 이 주소를 복사하세요!

### 5단계: LemonSqueezy 웹훅 등록

1. [LemonSqueezy Webhooks](https://app.lemonsqueezy.com/settings/webhooks) 접속
2. **Add Webhook** 클릭
3. 설정:
   - **Callback URL**: `https://abcd-1234.ngrok-free.app/api/webhooks/lemon`
   - **Signing Secret**: `.env.local`의 `LEMONSQUEEZY_WEBHOOK_SECRET`과 동일하게
   - **Events**: `subscription_created`, `order_created` 등 선택
4. **Save** 클릭

### 6단계: 테스트 웹훅 전송

1. 저장된 웹훅 옆의 **Test** 버튼 클릭
2. 이벤트 선택 (예: `subscription_created`)
3. **Send Test Webhook** 클릭
4. 로컬 터미널에서 `Processing LemonSqueezy webhook...` 로그 확인!

---

## 🚀 배포 환경 (Vercel 등)

배포된 서버가 있다면 ngrok 없이 바로 테스트할 수 있어요.

### 웹훅 URL 설정

```
https://your-app.vercel.app/api/webhooks/lemon
```

### 환경변수 확인

Vercel Dashboard → Settings → Environment Variables에서 확인:

- `LEMONSQUEEZY_WEBHOOK_SECRET` 설정되어 있는지 확인

---

## ⚠️ 주의사항

### ngrok URL은 매번 바뀌어요!

- ngrok을 재시작하면 URL이 바뀝니다
- 테스트할 때마다 LemonSqueezy 웹훅 URL 업데이트 필요
- **유료 플랜**을 사용하면 고정 도메인 사용 가능

### Test Webhook의 한계

- LemonSqueezy의 "Test Webhook" 버튼은 **가짜 데이터**를 보내요
- `custom_data.user_id`가 없어서 DB에 `user_id`가 저장 안 될 수 있어요
- 실제 결제 흐름으로 테스트하는 게 가장 정확해요

---

## 💬 문제 해결

| 에러                 | 원인                  | 해결책                                |
| -------------------- | --------------------- | ------------------------------------- |
| **401 Unauthorized** | Webhook Secret 불일치 | `.env.local`과 LemonSqueezy 설정 확인 |
| **500 Error**        | 서버 에러             | 터미널 로그 확인                      |
| **연결 안 됨**       | ngrok 미실행          | `ngrok http 3000` 실행 확인           |
| **DB 저장 안 됨**    | user_id 누락          | 실제 결제로 테스트 필요               |

---

## ✅ 테스트 완료 체크리스트

- [ ] ngrok 터널 실행 중
- [ ] LemonSqueezy 웹훅 URL 등록 완료
- [ ] Test Webhook 전송 성공
- [ ] 로컬 서버 로그에서 `Processing LemonSqueezy webhook...` 확인
- [ ] Supabase `lemon_webhook_events` 테이블에 데이터 저장 확인

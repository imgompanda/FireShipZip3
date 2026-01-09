# 📧 DNS 설정 가이드 (이메일 스팸 방지)

이메일이 스팸함에 안 들어가려면 **DNS 레코드 설정**이 필수예요.

> [!WARNING]
> **이 설정은 본인 소유의 도메인이 있어야 가능해요!**  
> 도메인이 없다면 [가비아](https://gabia.com), [Namecheap](https://namecheap.com) 등에서 먼저 구매하세요.

---

## 🤔 왜 DNS 설정이 필요한가요?

이메일 서버들은 "이 이메일이 진짜 이 도메인에서 보낸 게 맞아?"를 확인해요.  
DNS 레코드가 없으면 → 의심스럽다고 판단 → **스팸함으로 이동** 😭

설정하면:

- ✅ 스팸함 회피
- ✅ 이메일 도달율 향상
- ✅ 브랜드 신뢰도 상승

---

## 📋 설정해야 할 DNS 레코드

| 레코드    | 역할                              | 필수    |
| --------- | --------------------------------- | ------- |
| **SPF**   | "이 IP에서 보낸 메일만 진짜야"    | ✅      |
| **DKIM**  | "이 서명이 있으면 위조 안 됐어"   | ✅      |
| **DMARC** | "SPF/DKIM 실패하면 이렇게 처리해" | ⭐ 권장 |

---

## 🔧 Step 1: Resend에서 도메인 추가

1. [Resend Dashboard](https://resend.com/domains) → **Domains**
2. **Add Domain** 클릭
3. 도메인 입력:
   - 서브도메인 권장: `mail.yourdomain.com` 또는 `send.yourdomain.com`
   - 메인 도메인도 가능: `yourdomain.com`

> 💡 **서브도메인을 쓰는 이유**: 메인 도메인의 이메일 설정에 영향을 주지 않아요.

---

## 🔧 Step 2: DNS 레코드 추가

Resend가 보여주는 레코드들을 **DNS 관리 패널**에 추가하세요.

### 어디서 추가하나요?

| 도메인 구매처 | DNS 관리 위치                     |
| ------------- | --------------------------------- |
| 가비아        | 도메인 관리 → DNS 관리            |
| 후이즈        | My후이즈 → 도메인 관리 → DNS 설정 |
| Namecheap     | Domain List → Advanced DNS        |
| Cloudflare    | DNS → Records                     |
| AWS Route53   | Hosted zones → 도메인 선택        |

### 추가할 레코드들

Resend Dashboard에서 보여주는 값을 그대로 복사해서 붙여넣으세요:

#### 1. SPF 레코드 (TXT)

```
Type: TXT
Name: @ (또는 서브도메인)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600 (또는 Auto)
```

#### 2. DKIM 레코드 (CNAME)

Resend가 제공하는 3개의 CNAME 레코드를 추가하세요:

```
Type: CNAME
Name: resend._domainkey
Value: (Resend에서 제공하는 값)
TTL: 3600

Type: CNAME
Name: resend2._domainkey
Value: (Resend에서 제공하는 값)
TTL: 3600

Type: CNAME
Name: resend3._domainkey
Value: (Resend에서 제공하는 값)
TTL: 3600
```

#### 3. DMARC 레코드 (TXT) - 권장

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your@email.com
TTL: 3600
```

> 💡 `p=none`은 모니터링 모드예요. 나중에 `p=quarantine` 또는 `p=reject`로 변경할 수 있어요.

---

## 🔧 Step 3: 인증 확인

1. DNS 레코드 추가 후 **5분~48시간** 대기 (보통 5분이면 됨)
2. Resend Dashboard → Domains → **Verify** 클릭
3. 모든 레코드가 ✅ 녹색이면 성공!

---

## ✅ 체크리스트

- [ ] 도메인을 Resend에 추가했나요?
- [ ] SPF 레코드를 추가했나요?
- [ ] DKIM 레코드 3개를 추가했나요?
- [ ] DMARC 레코드를 추가했나요? (권장)
- [ ] Resend에서 모든 레코드가 Verified인가요?
- [ ] `.env.local`에 `RESEND_FROM_EMAIL` 설정했나요?

---

## 🧪 테스트하기

설정 후 테스트 이메일을 보내보세요:

1. 본인 Gmail로 이메일 발송
2. Gmail에서 이메일 열기
3. 점 3개 메뉴 → **"원본 보기"** 클릭
4. 확인할 것:
   - `SPF: PASS` ✅
   - `DKIM: PASS` ✅
   - `DMARC: PASS` ✅

---

## 💬 문제 해결

### DNS가 안 바뀌어요

→ DNS 전파에 최대 48시간 걸릴 수 있어요. 보통 5분이면 되지만, 기다려보세요.

### SPF가 FAIL이에요

→ SPF 레코드가 정확한지 확인하세요. 기존 SPF가 있다면 합쳐야 해요:

```
v=spf1 include:_spf.google.com include:_spf.resend.com ~all
```

### DKIM이 FAIL이에요

→ CNAME 값을 정확히 복사했는지 확인하세요. 앞뒤 공백이 있으면 안 돼요.

---

## 🔗 참고 링크

- [Resend 공식 DNS 가이드](https://resend.com/docs/dashboard/domains/introduction)
- [SPF 레코드 확인](https://mxtoolbox.com/spf.aspx)
- [DKIM 레코드 확인](https://mxtoolbox.com/dkim.aspx)

---

**설정 완료!** 이제 이메일이 제대로 도착할 거예요 📬

-- =========================================
-- Supabase Database Schema for SaaS Starter Kit
-- LemonSqueezy 버전
-- =========================================

-- 1. Users 테이블 (Supabase Auth와 연동)
-- =========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users 정책: 본인 데이터만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ⭐ 핵심: auth.users → public.users 자동 동기화 트리거
-- 새 사용자가 가입하면 자동으로 public.users에 복사
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (auth.users에 INSERT 시 실행)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 기존 auth.users 데이터를 public.users로 마이그레이션 (1회성)
INSERT INTO public.users (id, email, full_name, avatar_url)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- =========================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- LemonSqueezy 식별자
  lemon_customer_id TEXT,
  lemon_subscription_id TEXT UNIQUE,
  
  -- 구독 상태 (7가지)
  status TEXT CHECK (status IN (
    'active',      -- 정상 결제 중
    'trialing',    -- 무료 체험 중
    'past_due',    -- 결제 실패 (재시도 중)
    'grace_period',-- 유예 기간 (읽기 전용)
    'unpaid',      -- 서비스 중단
    'canceled',    -- 해지됨
    'paused'       -- 일시정지
  )) DEFAULT 'active',
  
  -- 플랜 정보
  plan_id TEXT,
  plan_name TEXT,
  
  -- 결제 주기
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  
  -- 해지 예약
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions 정책: 본인 구독만 조회 가능
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_subscription_id ON public.subscriptions(lemon_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 3. LemonSqueezy Webhook Events 테이블 (디버깅/Audit용)
-- =========================================
CREATE TABLE IF NOT EXISTS public.lemon_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- RLS 활성화 (관리자용이므로 일반 사용자 접근 차단)
ALTER TABLE public.lemon_webhook_events ENABLE ROW LEVEL SECURITY;

-- 정책: 모든 일반 접근 차단 (Service Role은 RLS 우회하므로 Webhook에서만 접근 가능)
CREATE POLICY "No public access to webhook events" ON public.lemon_webhook_events
  FOR ALL USING (false);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_lemon_webhook_events_event_type ON public.lemon_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_lemon_webhook_events_status ON public.lemon_webhook_events(status);

-- 4. 트리거: updated_at 자동 갱신
-- =========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Subscriptions 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Purchases 테이블 (일회성 결제 정보)
-- =========================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- LemonSqueezy 식별자
  lemon_order_id TEXT UNIQUE NOT NULL,
  lemon_customer_id TEXT,
  
  -- 상품 정보
  product_name TEXT,
  variant_name TEXT,
  
  -- 결제 정보
  amount INTEGER, -- cents 단위
  currency TEXT,
  status TEXT DEFAULT 'paid', -- paid, refunded
  receipt_url TEXT,
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Purchases 정책: 본인 구매 내역만 조회 가능
CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_lemon_order_id ON public.purchases(lemon_order_id);

-- Purchases 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_purchases_updated_at ON public.purchases;
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Support Tickets 테이블 (고객 지원)
-- =========================================
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_category AS ENUM ('billing', 'account', 'technical', 'general');

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category ticket_category DEFAULT 'general',
  status ticket_status DEFAULT 'open',
  
  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 정책 1: 인증된 사용자는 본인 user_id로만 티켓 생성, 비인증은 user_id가 NULL이어야 함
CREATE POLICY "Authenticated users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (
    -- 로그인 사용자: 본인 user_id만
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    -- 비로그인 사용자: user_id가 NULL이어야 함
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- 정책 2: 본인 티켓 조회 (로그인 유저)
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

-- 정책 3: 관리자는 모든 티켓 조회 및 수정 (service_role 사용 권장되나, RLS 정책으로도 추가 가능)
-- 여기서는 authenticated 유저 중 특정 조건(예: admin_emails)을 체크하는 방식으로 예시를 듭니다.
-- 실제 운영 환경에서는 service_role 클라이언트를 쓰거나, 전용 admin 권한 테이블을 두는 것이 좋습니다.
CREATE POLICY "Admins can view all tickets" ON public.support_tickets
  FOR SELECT USING (true); -- 임시: 테스트를 위해 authenticated 유저 모두에게 허용 (필요시 수정)

CREATE POLICY "Admins can update all tickets" ON public.support_tickets
  FOR UPDATE USING (true); -- 임시: 테스트를 위해 authenticated 유저 모두에게 허용 (필요시 수정)

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- 트리거 적용
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

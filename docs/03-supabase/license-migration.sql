-- =========================================
-- License Code Migration Script
-- 라이선스 코드 보안 및 고유성 보장
-- =========================================

-- 0. license_key 컬럼이 없으면 먼저 추가
-- =========================================
ALTER TABLE public.purchases 
  ADD COLUMN IF NOT EXISTS license_key TEXT;

-- 0.5. user_id NOT NULL 제약 조건 제거 (라이선스 먼저 저장, 나중에 사용자 연결)
-- =========================================
ALTER TABLE public.purchases 
  ALTER COLUMN user_id DROP NOT NULL;

-- 1. license_key에 UNIQUE 제약 조건 추가 (중복 사용 방지)
-- =========================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'purchases_license_key_unique'
  ) THEN
    ALTER TABLE public.purchases 
      ADD CONSTRAINT purchases_license_key_unique UNIQUE (license_key);
  END IF;
END $$;

-- 2. license_key 조회를 위한 인덱스 추가 (성능 최적화)
-- =========================================
CREATE INDEX IF NOT EXISTS idx_purchases_license_key ON public.purchases(license_key);

-- 3. 라이선스 검증용 함수 (Optional: 활성화 시 체크)
-- =========================================
CREATE OR REPLACE FUNCTION public.validate_license_key(input_key TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  product_name TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TRUE AS is_valid,
    p.user_id,
    p.product_name,
    p.status
  FROM public.purchases p
  WHERE p.license_key = input_key
  LIMIT 1;
  
  -- 일치하는 키가 없으면 빈 결과 반환
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- 사용 방법:
-- SELECT * FROM public.validate_license_key('YOUR-LICENSE-KEY');
-- 결과: is_valid=true면 유효, false면 무효
-- =========================================

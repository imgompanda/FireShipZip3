-- ========================================
-- RAG 챗봇 DB 스키마
-- Supabase SQL Editor에서 실행하세요
-- ========================================

-- pgvector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- ========================================
-- 1. 지식 베이스 문서 (임베딩 저장)
-- ========================================
CREATE TABLE public.knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  embedding extensions.vector(768),
  metadata jsonb DEFAULT '{}',
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- HNSW 인덱스 (코사인 유사도 검색)
CREATE INDEX knowledge_documents_embedding_idx
  ON public.knowledge_documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX knowledge_documents_category_idx
  ON public.knowledge_documents(category);

-- RLS
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active documents"
  ON public.knowledge_documents
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage documents"
  ON public.knowledge_documents
  FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- 2. 챗봇 대화 기록
-- ========================================
CREATE TABLE public.chatbot_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  messages jsonb DEFAULT '[]',
  visitor_context jsonb DEFAULT '{}',
  language text DEFAULT 'ko',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX chatbot_conversations_session_idx
  ON public.chatbot_conversations(session_id);

ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages conversations"
  ON public.chatbot_conversations
  FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- 3. 리드 수집 (잠재 고객)
-- ========================================
CREATE TABLE public.chatbot_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.chatbot_conversations(id),
  name text,
  email text,
  phone text,
  message text,
  ai_summary jsonb DEFAULT '{}',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX chatbot_leads_status_idx
  ON public.chatbot_leads(status);

ALTER TABLE public.chatbot_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages leads"
  ON public.chatbot_leads
  FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- 4. 유사도 검색 RPC 함수
-- ========================================
CREATE OR REPLACE FUNCTION match_knowledge_documents(
  query_embedding extensions.vector(768),
  match_count int DEFAULT 5,
  match_threshold float DEFAULT 0.3
) RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  metadata jsonb,
  similarity float
) AS $$
  SELECT
    kd.id,
    kd.title,
    kd.content,
    kd.category,
    kd.metadata,
    1 - (kd.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_documents kd
  WHERE kd.is_active = true
    AND 1 - (kd.embedding <=> query_embedding) >= match_threshold
  ORDER BY kd.embedding <=> query_embedding ASC
  LIMIT match_count;
$$ LANGUAGE sql;

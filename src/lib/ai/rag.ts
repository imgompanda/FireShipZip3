/**
 * RAG (Retrieval-Augmented Generation) 핵심 로직
 * - Gemini embedding-001로 임베딩 생성
 * - Supabase pgvector로 유사도 검색
 */
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { createAdminClient } from "@/utils/supabase/admin";
import { RAG_CONFIG } from "./config";

const embeddingModel = google.textEmbeddingModel("gemini-embedding-001");

/** 단일 텍스트 임베딩 */
export async function embedText(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
    providerOptions: {
      google: { outputDimensionality: RAG_CONFIG.embeddingDimension },
    },
  });
  return embedding;
}

/** 배치 임베딩 (10개씩 자동 분할) */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
    providerOptions: {
      google: { outputDimensionality: RAG_CONFIG.embeddingDimension },
    },
  });
  return embeddings;
}

/** 유사 문서 검색 (RAG 컨텍스트 조회) */
export async function searchKnowledge(
  query: string,
  count = RAG_CONFIG.searchCount,
  threshold = RAG_CONFIG.searchThreshold
) {
  const queryEmbedding = await embedText(query);
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("match_knowledge_documents", {
    query_embedding: queryEmbedding,
    match_count: count,
    match_threshold: threshold,
  });

  if (error) {
    console.error("[RAG] Search failed:", error);
    return [];
  }

  return data ?? [];
}

/** 문서 임베딩 후 Supabase에 저장 */
export async function embedAndSaveDocuments(
  documents: { title: string; content: string; category: string }[]
) {
  const supabase = createAdminClient();
  const BATCH_SIZE = 10;
  let savedCount = 0;

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    const texts = batch.map((d) => d.content);
    const embeddings = await embedTexts(texts);

    const rows = batch.map((doc, idx) => ({
      title: doc.title,
      content: doc.content,
      category: doc.category,
      embedding: JSON.stringify(embeddings[idx]),
      metadata: { indexed_at: new Date().toISOString() },
    }));

    const { error } = await supabase
      .from("knowledge_documents")
      .insert(rows);

    if (error) {
      console.error("[RAG] Insert failed:", error);
    } else {
      savedCount += rows.length;
    }
  }

  return savedCount;
}

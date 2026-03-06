import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { chunkText } from "@/lib/ai/chunker";
import { embedTexts } from "@/lib/ai/rag";

/** 관리자 확인 */
async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  if (!adminEmails.includes(user.email)) return null;

  return user;
}

/** POST: 문서 임베딩 생성 (개별 또는 전체) */
export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY not configured" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { documentId, all } = body;

  const supabase = createAdminClient();

  // 임베딩 대상 문서 조회
  let query = supabase
    .from("knowledge_documents")
    .select("id, title, content, category");

  if (all) {
    // 임베딩 없는 문서만
    query = query.is("embedding", null);
  } else if (documentId) {
    query = query.eq("id", documentId);
  } else {
    return NextResponse.json(
      { error: "documentId or all=true required" },
      { status: 400 }
    );
  }

  const { data: documents, error } = await query;

  if (error || !documents || documents.length === 0) {
    return NextResponse.json(
      { error: "No documents to embed", details: error?.message },
      { status: 404 }
    );
  }

  let totalEmbedded = 0;
  const BATCH_SIZE = 10;

  for (const doc of documents) {
    // 긴 문서는 청킹 → 첫 번째 청크를 대표 임베딩으로
    // (추후 멀티 청크 검색으로 확장 가능)
    const chunks = chunkText(doc.content, {
      source: doc.title,
      category: doc.category,
    });

    if (chunks.length === 0) continue;

    // 전체 문서 내용의 요약용 임베딩 (첫 3개 청크 합쳐서)
    const representativeText = chunks
      .slice(0, 3)
      .map((c) => c.content)
      .join("\n");

    try {
      const embeddings = await embedTexts([representativeText]);

      await supabase
        .from("knowledge_documents")
        .update({
          embedding: JSON.stringify(embeddings[0]),
          metadata: {
            chunk_count: chunks.length,
            embedded_at: new Date().toISOString(),
            char_count: doc.content.length,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", doc.id);

      totalEmbedded++;
    } catch (err) {
      console.error(`[embed] Failed for doc ${doc.id}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    embedded: totalEmbedded,
    total: documents.length,
  });
}

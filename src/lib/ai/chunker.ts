/**
 * 문서 청킹 — 텍스트를 임베딩용 청크로 분할
 * ditfinder 패턴 기반
 */

export interface TextChunk {
  content: string;
  index: number;
  metadata: {
    source: string;
    category: string;
    chunk_index: number;
  };
}

interface ChunkOptions {
  maxLength?: number;
  overlap?: number;
  source?: string;
  category?: string;
}

/** 텍스트를 청크로 분할 (800자 기본, 100자 오버랩) */
export function chunkText(
  text: string,
  options?: ChunkOptions
): TextChunk[] {
  const maxLength = options?.maxLength ?? 800;
  const overlap = options?.overlap ?? 100;
  const source = options?.source ?? "unknown";
  const category = options?.category ?? "general";

  // 1단계: 문단 기반 분할
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // 2단계: 긴 문단은 문장 단위로 재분할
  const rawChunks: string[] = [];
  for (const para of paragraphs) {
    if (para.length <= maxLength) {
      rawChunks.push(para);
    } else {
      const sentences = para.split(/(?<=[.!?。]\s)/);
      let current = "";
      for (const sentence of sentences) {
        if (
          current.length + sentence.length > maxLength &&
          current.length > 0
        ) {
          rawChunks.push(current.trim());
          const overlapText = current.slice(-overlap);
          current = overlapText + sentence;
        } else {
          current += sentence;
        }
      }
      if (current.trim().length > 0) {
        rawChunks.push(current.trim());
      }
    }
  }

  // 3단계: 200자 미만 청크는 이전과 병합
  const merged: string[] = [];
  for (let i = 0; i < rawChunks.length; i++) {
    const chunk = rawChunks[i];
    if (chunk.length < 200 && merged.length > 0) {
      const prev = merged[merged.length - 1];
      if (prev.length + chunk.length + 1 <= maxLength) {
        merged[merged.length - 1] = prev + "\n" + chunk;
        continue;
      }
    }
    merged.push(chunk);
  }

  // 마지막 청크가 200자 미만이면 이전과 병합
  if (merged.length > 1 && merged[merged.length - 1].length < 200) {
    const last = merged.pop()!;
    merged[merged.length - 1] += "\n" + last;
  }

  return merged.map((content, index) => ({
    content,
    index,
    metadata: {
      source,
      category,
      chunk_index: index,
    },
  }));
}

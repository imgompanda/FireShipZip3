export const AI_MODELS = {
  chat: "gemini-2.5-flash",
  image: "gemini-2.0-flash-exp",
} as const;

export const AI_CONFIG = {
  maxDuration: {
    chat: 60,
    image: 120,
    video: 300,
    chatbot: 30,
  },
  defaults: {
    image: {
      size: "1024x1024" as const,
      quality: "standard" as const,
    },
    video: {
      aspectRatio: "16:9" as const,
      duration: 5,
    },
  },
} as const;

/** RAG 챗봇 설정 */
export const RAG_CONFIG = {
  /** 채팅 모델 (Gemini 2.5 Flash Lite - 빠르고 저렴) */
  chatModel: "gemini-2.5-flash-lite",
  /** 임베딩 모델 */
  embeddingModel: "gemini-embedding-001",
  /** 임베딩 차원 (768 = 비용 효율적, 3072 = 최고 품질) */
  embeddingDimension: 768,
  /** 유사도 검색 결과 수 */
  searchCount: 5,
  /** 유사도 임계값 (0~1, 높을수록 엄격) */
  searchThreshold: 0.3,
  /** 최대 응답 토큰 */
  maxOutputTokens: 500,
  /** 청크 최대 길이 */
  chunkMaxLength: 800,
  /** 청크 오버랩 */
  chunkOverlap: 100,
} as const;

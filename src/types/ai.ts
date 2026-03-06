export interface AIImageResult {
  base64: string;
  url?: string;
  prompt: string;
  size: string;
  quality: string;
  createdAt: string;
}

export interface AIVideoResult {
  base64: string;
  url?: string;
  prompt: string;
  aspectRatio: string;
  duration: number;
  createdAt: string;
}

export type AIMode = "chat" | "image" | "video";

export interface AIGenerationRequest {
  prompt: string;
  size?: string;
  quality?: string;
  aspectRatio?: string;
  duration?: number;
}

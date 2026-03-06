import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { uploadToSupabase } from "@/lib/ai/storage";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { prompt, size = "1024x1024", quality = "standard" } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: size as "1024x1024" | "1536x1024" | "1024x1536",
      providerOptions: {
        openai: { quality },
      },
    });

    const base64 = image.base64;
    let url: string | null = null;

    // 로그인 사용자면 Supabase Storage에 저장
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && base64) {
      const buffer = Buffer.from(base64, "base64");
      url = await uploadToSupabase(buffer, user.id, "image");
    }

    return NextResponse.json({
      base64,
      url,
      prompt,
      size,
      quality,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}

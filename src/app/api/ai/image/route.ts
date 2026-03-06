import { experimental_generateImage as generateImage } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { uploadToSupabase } from "@/lib/ai/storage";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    // 인증 체크
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const { image } = await generateImage({
      model: google.image("gemini-2.0-flash-exp"),
      prompt,
    });

    const base64 = image.base64;
    let url: string | null = null;

    // 인증된 사용자이므로 Supabase Storage에 저장
    if (base64) {
      const buffer = Buffer.from(base64, "base64");
      url = await uploadToSupabase(buffer, user.id, "image");
    }

    return NextResponse.json({
      base64,
      url,
      prompt,
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

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { uploadToSupabase } from "@/lib/ai/storage";
import { cookies } from "next/headers";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    // 인증 체크 (데모 모드면 스킵)
    const cookieStore = await cookies();
    const isDemoMode = cookieStore.get("demo_mode")?.value === "true";
    let userId: string | null = null;

    if (!isDemoMode) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }
      userId = user.id;
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: google("gemini-2.5-flash-image"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      prompt: `Generate an image: ${prompt}`,
    });

    // 응답에서 이미지 파일 추출
    const imageFile = result.files?.[0];

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    const base64 = imageFile.base64;
    let url: string | null = null;

    // 인증된 사용자만 Supabase Storage에 저장
    if (base64 && userId) {
      const buffer = Buffer.from(base64, "base64");
      url = await uploadToSupabase(buffer, userId, "image");
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

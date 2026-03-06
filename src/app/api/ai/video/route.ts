import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(req: Request) {
  const hasFalKey = !!process.env.FAL_API_KEY;

  if (!hasFalKey) {
    return NextResponse.json(
      { error: "Video generation requires FAL_API_KEY" },
      { status: 503 }
    );
  }

  try {
    const { prompt, aspectRatio = "16:9", duration = 5 } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Stub: FAL SDK integration would go here
    // when @ai-sdk/fal is installed, replace with actual generateVideo call
    return NextResponse.json(
      {
        error: "Video generation is not yet implemented. Install @ai-sdk/fal to enable.",
        prompt,
        aspectRatio,
        duration,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}

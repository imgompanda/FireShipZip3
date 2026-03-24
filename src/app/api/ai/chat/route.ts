import { streamText, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/** UIMessage (parts) -> ModelMessage (content) 변환 */
function toModelMessages(uiMessages: UIMessage[]) {
  return uiMessages.map((msg) => {
    const text =
      msg.parts
        ?.filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("") || "";
    return { role: msg.role as "user" | "assistant", content: text };
  });
}

export const maxDuration = 60;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  if (!isDemoMode) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: "You are a helpful AI assistant.",
    messages: toModelMessages(messages),
  });

  return result.toDataStreamResponse();
}

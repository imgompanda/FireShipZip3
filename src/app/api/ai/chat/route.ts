import { streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/utils/supabase/server";

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful AI assistant.",
    messages: toModelMessages(messages),
  });

  return result.toTextStreamResponse();
}

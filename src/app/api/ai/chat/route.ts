// @ts-nocheck
import { streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: "You are a helpful AI assistant.",
    messages: messages as any,
  });

  return result.toTextStreamResponse();
}

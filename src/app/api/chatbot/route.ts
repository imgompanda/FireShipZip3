// @ts-nocheck
import { streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { createAdminClient } from "@/utils/supabase/admin";
import { searchKnowledge } from "@/lib/ai/rag";
import { RAG_CONFIG, AI_CONFIG } from "@/lib/ai/config";

/** UIMessage (parts) → ModelMessage (content) 변환 */
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

const chatModel = google(RAG_CONFIG.chatModel);

export const maxDuration = 60;

export async function POST(req: Request) {
  // GOOGLE_GENERATIVE_AI_API_KEY 미설정 시 안내
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "Chatbot requires GOOGLE_GENERATIVE_AI_API_KEY",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const { messages, sessionId, language } = body;

  if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createAdminClient();

  // 대화 세션 생성/조회
  const { data: existingConv } = await supabase
    .from("chatbot_conversations")
    .select("id")
    .eq("session_id", sessionId)
    .single();

  let conversationId: string;

  if (existingConv) {
    conversationId = existingConv.id;
  } else {
    const { data: newConv, error: convError } = await supabase
      .from("chatbot_conversations")
      .insert({
        session_id: sessionId,
        messages: [],
        language: language || "ko",
        visitor_context: body.visitorContext || {},
      })
      .select("id")
      .single();

    if (convError || !newConv) {
      console.error("[chatbot] Failed to create conversation:", convError);
      return new Response(
        JSON.stringify({ error: "Failed to create conversation" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    conversationId = newConv.id;
  }

  const modelMessages = toModelMessages(messages);

  // RAG: 최신 사용자 메시지로 지식 베이스 검색
  const lastUserMsg = modelMessages.filter((m) => m.role === "user").pop();
  let context = "";
  if (lastUserMsg?.content) {
    const relevantDocs = await searchKnowledge(lastUserMsg.content);
    if (relevantDocs.length > 0) {
      context = relevantDocs
        .map(
          (d: { category: string; content: string }) =>
            `[${d.category}] ${d.content}`
        )
        .join("\n\n");
    }
  }

  // 사용자 메시지 저장
  if (lastUserMsg?.content) {
    await appendMessage(supabase, conversationId, {
      role: "user",
      content: lastUserMsg.content,
      timestamp: new Date().toISOString(),
    });
  }

  const systemPrompt = buildSystemPrompt(context);

  const result = streamText({
    model: chatModel,
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      collect_contact: tool({
        description:
          "Save visitor contact information as a lead. Call this when the user provides their name, email, or phone number.",
        parameters: z.object({
          name: z.string().describe("Visitor name"),
          email: z.string().describe("Visitor email address"),
          phone: z
            .string()
            .describe("Visitor phone number (empty string if not provided)"),
        }),
        execute: async ({ name, email, phone }) => {
          const { error } = await supabase.from("chatbot_leads").insert({
            conversation_id: conversationId,
            name: name || null,
            email: email || null,
            phone: phone || null,
            status: "new",
          });

          if (error) {
            console.error("[chatbot] Lead creation failed:", error);
            return { success: false };
          }

          return {
            success: true,
            message: `Contact saved: ${name || ""}${email ? ` (${email})` : ""}`,
          };
        },
      }),
    },
    maxTokens: RAG_CONFIG.maxOutputTokens,
    onFinish: async ({ text }) => {
      if (text) {
        await appendMessage(supabase, conversationId, {
          role: "assistant",
          content: text,
          timestamp: new Date().toISOString(),
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

/** 대화에 메시지 추가 */
async function appendMessage(
  supabase: ReturnType<typeof createAdminClient>,
  conversationId: string,
  message: { role: string; content: string; timestamp: string }
) {
  const { data: conv } = await supabase
    .from("chatbot_conversations")
    .select("messages")
    .eq("id", conversationId)
    .single();

  const currentMessages = (conv?.messages as unknown[]) || [];

  await supabase
    .from("chatbot_conversations")
    .update({ messages: [...currentMessages, message] })
    .eq("id", conversationId);
}

/** 시스템 프롬프트 생성 (RAG 컨텍스트 주입) */
function buildSystemPrompt(context: string): string {
  const basePrompt = `You are a helpful AI assistant for this website. Your job is to:
1. Answer visitor questions about the service/product
2. Help guide visitors toward making a purchase
3. Collect contact information when appropriate

## Response Rules
- Keep answers concise: 2-4 sentences max
- Be friendly, helpful, and professional
- Answer in the same language the visitor writes in
- Do NOT make up information that isn't in the knowledge base
- If you don't know something, say so honestly

## Contact Collection
After answering 2-3 questions, naturally suggest leaving contact info:
"If you'd like personalized help, feel free to share your name and email!"
When the user provides contact info, use the collect_contact tool.`;

  if (context) {
    return `${basePrompt}

## Knowledge Base (use this to answer questions)
${context}`;
  }

  return basePrompt;
}

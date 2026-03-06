import { checkIsAdmin } from "@/services/auth/admin";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ChatbotAdminPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    const { redirect } = await import("next/navigation");
    return redirect("/dashboard");
  }

  const supabase = createAdminClient();

  // 최근 대화 조회
  const { data: conversations } = await supabase
    .from("chatbot_conversations")
    .select("id, session_id, messages, language, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(50);

  // 리드 조회
  const { data: leads } = await supabase
    .from("chatbot_leads")
    .select("id, name, email, phone, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const convs = conversations || [];
  const allLeads = leads || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-base-content">
          Chatbot Dashboard
        </h1>
        <p className="text-sm text-base-content/50 mt-1">
          AI 챗봇 대화 기록과 수집된 리드를 확인하세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <p className="text-sm text-base-content/50">총 대화</p>
          <p className="text-2xl font-bold text-base-content">
            {convs.length}
          </p>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <p className="text-sm text-base-content/50">수집된 리드</p>
          <p className="text-2xl font-bold text-warning">
            {allLeads.length}
          </p>
        </div>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4">
          <p className="text-sm text-base-content/50">오늘 대화</p>
          <p className="text-2xl font-bold text-base-content">
            {
              convs.filter(
                (c) =>
                  new Date(c.created_at).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </div>
      </div>

      {/* Leads */}
      <section>
        <h2 className="text-lg font-semibold text-base-content mb-3">
          수집된 리드
        </h2>
        {allLeads.length === 0 ? (
          <p className="text-base-content/50 text-sm">아직 수집된 리드가 없습니다</p>
        ) : (
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-300 bg-base-200">
                  <th className="text-left px-4 py-2 font-medium text-base-content/50">
                    이름
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-base-content/50">
                    이메일
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-base-content/50">
                    전화
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-base-content/50">
                    상태
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-base-content/50">
                    날짜
                  </th>
                </tr>
              </thead>
              <tbody>
                {allLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-base-300/50"
                  >
                    <td className="px-4 py-3 text-base-content">
                      {lead.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-base-content/70">
                      {lead.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-base-content/70">
                      {lead.phone || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          lead.status === "new"
                            ? "bg-success/10 text-success"
                            : "bg-base-200 text-base-content/50"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-base-content/50 text-xs">
                      {new Date(lead.created_at).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Conversations */}
      <section>
        <h2 className="text-lg font-semibold text-base-content mb-3">
          최근 대화
        </h2>
        {convs.length === 0 ? (
          <p className="text-base-content/50 text-sm">아직 대화 기록이 없습니다</p>
        ) : (
          <div className="space-y-2">
            {convs.map((conv) => {
              const msgs = conv.messages as Array<{
                role: string;
                content: string;
              }>;
              const msgCount = msgs?.length || 0;
              const lastMsg = msgs?.[msgs.length - 1];

              return (
                <div
                  key={conv.id}
                  className="bg-base-100 border border-base-300 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-base-content/50 font-mono">
                      {conv.session_id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-base-content/50">
                      {msgCount}개 메시지 &middot;{" "}
                      {new Date(conv.updated_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  {lastMsg && (
                    <p className="text-sm text-base-content/70 line-clamp-1">
                      <span className="font-medium">
                        {lastMsg.role === "user" ? "방문자" : "AI"}:
                      </span>{" "}
                      {lastMsg.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

import { checkIsAdmin } from "@/services/auth/admin";
import { KnowledgeManager } from "./KnowledgeManager";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    const { redirect } = await import("next/navigation");
    return redirect("/dashboard");
  }

  return <KnowledgeManager />;
}

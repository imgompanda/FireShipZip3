import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { SupportTicketForm } from "@/components/features/support/SupportTicketForm";
import { UserTicketList } from "@/components/features/support/UserTicketList";
import { createClient } from "@/utils/supabase/server";
import { getUserTickets } from "@/services/support/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslations } from "next-intl/server";

export default async function SupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations("Support");

  const tickets = user ? await getUserTickets() : [];

  return (
    <div className="flex min-h-screen flex-col pt-24">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center">{t("title")}</h1>
        <p className="text-center text-muted-foreground mb-8">
          {t("description")}
        </p>

        {user ? (
          <Tabs defaultValue="new" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="new">{t("tabs.newTicket")}</TabsTrigger>
                <TabsTrigger value="history">{t("tabs.myTickets")}</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="new">
              <SupportTicketForm initialEmail={user.email} />
            </TabsContent>
            <TabsContent value="history">
              <UserTicketList tickets={tickets} />
            </TabsContent>
          </Tabs>
        ) : (
          <SupportTicketForm />
        )}
      </main>
      <Footer />
    </div>
  );
}

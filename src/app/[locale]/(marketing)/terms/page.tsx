import { Header } from "@/components/shared/Header";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Legal" });
  return {
    title: `${t("termsTitle")} - SaaS Kit`,
  };
}

export default async function TermsPage() {
  const t = await getTranslations("Legal");

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">{t("termsTitle")}</h1>
        <div className="prose dark:prose-invert max-w-none prose-headings:text-black dark:prose-headings:text-white prose-p:text-black dark:prose-p:text-white prose-li:text-black dark:prose-li:text-white prose-strong:text-black dark:prose-strong:text-white">
          <p className="lead">{t("lastUpdated")}: 2025-01-01</p>

          <h2>1. {t("terms.introduction")}</h2>
          <p>
            Welcome to SaaS Kit. By accessing our website, you agree to be bound
            by these Terms of Service. (This is a mockup text for demonstration
            purposes).
          </p>

          <h2>2. {t("terms.usage")}</h2>
          <p>
            You agree to use our service only for lawful purposes. You are
            prohibited from violating any laws in your jurisdiction while using
            our service.
          </p>

          <h2>3. {t("terms.termination")}</h2>
          <p>
            We adhere to a strict policy regarding the termination of accounts.
            We reserve the right to terminate or suspend access to our service
            immediately, without prior notice or liability, for any reason
            whatsoever.
          </p>

          <h2>4. {t("terms.contact")}</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            support@example.com.
          </p>
        </div>
      </main>
    </div>
  );
}

import { Header } from "@/components/shared/Header";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Legal" });
  return {
    title: `${t("privacyTitle")} - SaaS Kit`,
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Legal");

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">{t("privacyTitle")}</h1>
        <div className="prose dark:prose-invert max-w-none prose-headings:text-black dark:prose-headings:text-white prose-p:text-black dark:prose-p:text-white prose-li:text-black dark:prose-li:text-white prose-strong:text-black dark:prose-strong:text-white">
          <p className="lead">{t("lastUpdated")}: 2025-01-01</p>

          <h2>1. {t("privacy.collection")}</h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, subscribe to our newsletter, or request customer
            support. (This is a mockup text for demonstration purposes).
          </p>

          <h2>2. {t("privacy.usage")}</h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, as well as to communicate with you about products,
            services, offers, and events.
          </p>

          <h2>3. {t("privacy.cookies")}</h2>
          <p>
            We and our service providers use cookies and similar technologies to
            collect information about your interactions with our Services.
          </p>

          <h2>4. {t("privacy.contact")}</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at support@example.com.
          </p>
        </div>
      </main>
    </div>
  );
}

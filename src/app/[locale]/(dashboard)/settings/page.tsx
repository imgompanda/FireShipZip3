import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";
import { DashboardSidebar } from "@/components/features/dashboard/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { checkIsAdmin } from "@/services/auth/admin";
import { cookies } from "next/headers";

export default async function SettingsPage() {
  const t = await getTranslations("Settings");
  const tDemo = await getTranslations("Dashboard.demo");
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let user: User | null = null;

  if (isDemoMode) {
    user = {
      id: "demo-user",
      email: "demo@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User;
  } else {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  }

  // Admin 여부 확인
  const isAdmin = await checkIsAdmin(user?.email || undefined);

  return (
    <DashboardSidebar isAdmin={isAdmin}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Demo Banner */}
        {isDemoMode && (
          <div className="bg-info/10 border border-info/30 rounded-lg p-3 text-center mb-6">
            <span className="text-sm text-info">
              {tDemo.rich("banner", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}{" "}
              <Link href="/login" className="underline font-medium">
                {tDemo("loginLink")}
              </Link>
            </span>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-base-content/70 mt-1">
            {t("description")}
          </p>
        </div>

        <Separator className="my-6" />

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>{t("profile.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                disabled
              />
              <p className="text-xs text-base-content/50">{t("profile.emailHelp")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.nameLabel")}</Label>
              <Input id="name" placeholder={t("profile.namePlaceholder")} />
            </div>
            <Button disabled={isDemoMode}>{t("profile.saveButton")}</Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>{t("password.title")}</CardTitle>
            <CardDescription>{t("password.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">{t("password.currentLabel")}</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">{t("password.newLabel")}</Label>
              <Input id="new" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">{t("password.confirmLabel")}</Label>
              <Input id="confirm" type="password" />
            </div>
            <Button disabled={isDemoMode}>{t("password.updateButton")}</Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Danger Zone */}
        <Card className="border-error/30">
          <CardHeader>
            <CardTitle className="text-error">
              {t("danger.title")}
            </CardTitle>
            <CardDescription>{t("danger.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t("danger.deleteTitle")}</h3>
              <p className="text-sm text-base-content/70 mb-4">
                {t("danger.deleteWarning")}
              </p>
              <Button variant="destructive" disabled={isDemoMode}>
                {t("danger.deleteButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardSidebar>
  );
}

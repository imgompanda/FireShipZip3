"use client";

import {
  Home,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  BellRing,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/routing";
import { logout } from "@/services/auth/actions";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// SSR-safe mount status detection
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function DashboardSidebar({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = useTranslations("Dashboard.sidebar");

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!isMounted) {
    return (
      <div className="flex min-h-screen bg-base-100 font-sans">
        <aside className="hidden md:flex flex-col border-r border-base-300 bg-base-100/80 backdrop-blur-xl w-64 fixed h-full z-30" />
        <div className="flex-1 md:ml-64">
          <header className="h-16 border-b border-base-300 bg-base-100/50 backdrop-blur-md" />
          <main className="p-8">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100 selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-base-300 bg-base-100 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] fixed inset-y-0 left-0 z-40",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div
          className={cn(
            "h-20 flex items-center px-6 border-b border-base-300",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                S
              </div>
              <span className="text-xl font-bold text-base-content">
                SaaS Kit
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-base-content/50 hover:text-base-content transition-colors",
              isCollapsed ? "" : "ml-auto"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto no-scrollbar">
          <SidebarNav isCollapsed={isCollapsed} isAdmin={isAdmin} />
        </div>

        <div className="p-4 border-t border-base-300 mt-auto space-y-2 bg-base-200/50 backdrop-blur-sm mx-2 mb-2 rounded-2xl">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "px-2"
            )}
          >
            <ThemeToggle />
            {!isCollapsed && (
              <span className="ml-3 text-sm text-base-content/70 font-medium">
                {t("theme")}
              </span>
            )}
          </div>
          <form action={logout}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-error hover:text-error hover:bg-error/10 h-10 px-2 rounded-xl transition-all",
                isCollapsed && "justify-center px-0"
              )}
              type="submit"
            >
              <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && t("logout")}
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "md:ml-72", // Default margin matches new width
          isCollapsed && "md:ml-20"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-base-300 bg-base-100/80 backdrop-blur-xl px-8 shadow-sm transition-all duration-200">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 p-0 border-base-300"
              >
                <div className="p-6 border-b border-base-300">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      S
                    </div>
                    <span className="text-xl font-bold">SaaS Kit</span>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  <SidebarNav isAdmin={isAdmin} />
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
                  <div className="flex items-center px-2 py-3">
                    <ThemeToggle />
                    <span className="ml-3 text-sm font-medium">{t("themeMode")}</span>
                  </div>
                  <form action={logout}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-error hover:text-error hover:bg-error/10"
                      type="submit"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      {t("logout")}
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>

            {/* Breadcrumbs or Page Title could go here */}
            <h1 className="text-lg font-semibold md:hidden">
              {t("dashboard")}
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-base-300 bg-transparent hover:bg-base-200"
            >
              <BellRing className="w-4 h-4 text-base-content/50" />
            </Button>
            <div className="h-8 w-[1px] bg-base-300 mx-1 hidden md:block" />
            {/* User Profile - Simple Avatar */}
            <div className="w-9 h-9 rounded-full bg-base-300 border-2 border-base-100 shadow-sm cursor-pointer hover:scale-105 transition-transform" />
          </div>
        </header>

        {/* Page Content with smooth fade in */}
        <main className="flex-1 p-6 md:p-10 pt-8 animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarNav({
  isCollapsed = false,
  isAdmin = false,
}: {
  isCollapsed?: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard.sidebar");

  const links = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/ai", label: t("aiStudio"), icon: Sparkles },
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/subscription", label: t("subscription"), icon: CreditCard },
    ...(isAdmin
      ? [
          {
            href: "/admin/overview",
            label: t("adminConsole"),
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-1.5 py-2">
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Button
            key={link.href}
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all duration-200 relative group h-11",
              isActive
                ? "bg-base-200 text-base-content shadow-sm"
                : "text-base-content/50 hover:bg-base-200 hover:text-base-content",
              isCollapsed
                ? "justify-center px-0 w-11 mx-auto"
                : "px-4 rounded-xl"
            )}
            asChild
            title={isCollapsed ? link.label : undefined}
          >
            <Link href={link.href}>
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <link.icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  !isCollapsed && "mr-3",
                  isActive
                    ? "text-primary"
                    : "text-base-content/50 group-hover:text-base-content/70"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-[15px]">{link.label}</span>
              )}
              {/* Active glow effect */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none" />
              )}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

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
      <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <aside className="hidden md:flex flex-col border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl w-64 fixed h-full z-30" />
        <div className="flex-1 md:ml-64">
          <header className="h-16 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md" />
          <main className="p-8">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-black selection:bg-purple-500/30">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] fixed inset-y-0 left-0 z-40",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div
          className={cn(
            "h-20 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-900/50",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                S
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                SaaS Kit
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors",
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

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-900/50 mt-auto space-y-2 bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-sm mx-2 mb-2 rounded-2xl">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "px-2"
            )}
          >
            <ThemeToggle />
            {!isCollapsed && (
              <span className="ml-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                Theme
              </span>
            )}
          </div>
          <form action={logout}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-10 px-2 rounded-xl transition-all",
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
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-8 shadow-sm transition-all duration-200">
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
                className="w-72 p-0 border-zinc-200 dark:border-zinc-800"
              >
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-900">
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
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex items-center px-2 py-3">
                    <ThemeToggle />
                    <span className="ml-3 text-sm font-medium">Theme Mode</span>
                  </div>
                  <form action={logout}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
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
              className="rounded-full w-10 h-10 border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <BellRing className="w-4 h-4 text-zinc-500" />
            </Button>
            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden md:block" />
            {/* User Profile - Simple Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800 border-2 border-white dark:border-zinc-950 shadow-sm cursor-pointer hover:scale-105 transition-transform" />
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
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/subscription", label: t("subscription"), icon: CreditCard },
    ...(isAdmin
      ? [
          {
            href: "/admin/overview",
            label: "Admin Console",
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
                ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200",
              isCollapsed
                ? "justify-center px-0 w-11 mx-auto"
                : "px-4 rounded-xl"
            )}
            asChild
            title={isCollapsed ? link.label : undefined}
          >
            <Link href={link.href}>
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-purple-600 rounded-r-full" />
              )}
              <link.icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  !isCollapsed && "mr-3",
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-[15px]">{link.label}</span>
              )}
              {/* Active glow effect */}
              {isActive && (
                <div className="absolute inset-0 bg-purple-500/5 dark:bg-purple-500/10 rounded-xl pointer-events-none" />
              )}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export function Header() {
  const t = useTranslations("Header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Header: Checking user session...");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log("Header: User found:", user?.email);
        setUser(user);
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const navItems = [
    { href: "#features", label: t("features") },
    { href: "#pricing", label: t("pricing") },
    { href: "#faq", label: t("faq") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
              🚀 SaaS Kit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Auth Buttons */}
            {!loading && (
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <Button size="sm" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/login">{t("getStarted")}</Link>
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-lg font-medium text-zinc-600 dark:text-zinc-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {user ? (
                  <Button className="w-full" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/login">{t("getStarted")}</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;

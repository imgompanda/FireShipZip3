"use client";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface AdminNavProps {
  links: { href: string; label: string }[];
  backLabel: string;
}

export function AdminNav({ links, backLabel }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-base-300 pb-4 items-center">
      {links.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(link.href + "/");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap",
              isActive
                ? "bg-base-200 text-base-content font-semibold border-b-2 border-primary"
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
            )}
          >
            {link.label}
          </Link>
        );
      })}

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-base-200 text-base-content/40 hover:text-base-content transition-colors whitespace-nowrap"
        >
          {backLabel}
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

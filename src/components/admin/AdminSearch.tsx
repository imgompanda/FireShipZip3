"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function AdminSearch({ placeholder }: { placeholder: string }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 h-9"
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function AdminPagination({
  currentPage,
  totalPages,
}: AdminPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

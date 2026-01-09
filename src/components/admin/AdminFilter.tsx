"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface FilterOption {
  label: string;
  value: string;
}

export function AdminFilter({
  name,
  placeholder,
  options,
}: {
  name: string;
  placeholder: string;
  options: FilterOption[];
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <Select
      defaultValue={searchParams.get(name) || "all"}
      onValueChange={handleFilter}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

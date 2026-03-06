"use client";

import { Button } from "@/components/ui/button";

interface DemoSaveButtonProps {
  isDemoMode: boolean;
  label: string;
  demoMessage?: string;
  variant?: "default" | "destructive";
}

export function DemoSaveButton({
  isDemoMode,
  label,
  demoMessage = "Demo mode: Settings cannot be changed.",
  variant = "default",
}: DemoSaveButtonProps) {
  const handleClick = () => {
    if (isDemoMode) {
      alert(demoMessage);
      return;
    }
    alert("Settings saved successfully!");
  };

  return (
    <Button variant={variant} onClick={handleClick}>
      {label}
    </Button>
  );
}

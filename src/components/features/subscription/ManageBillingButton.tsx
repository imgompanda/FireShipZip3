"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createPortalSession } from "@/services/lemon/actions";
import { toast } from "sonner";

interface ManageBillingButtonProps {
  hasSubscription: boolean;
  label: string;
}

export function ManageBillingButton({
  hasSubscription,
  label,
}: ManageBillingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!hasSubscription) {
      toast.error("No active subscription found");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPortalSession();
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.url) {
        // 클라이언트에서 직접 리다이렉트
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Failed to open billing portal");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasSubscription) {
    return null;
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        label
      )}
    </Button>
  );
}

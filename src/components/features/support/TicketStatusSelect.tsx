"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTicketStatus } from "@/services/support/admin-actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function TicketStatusSelect({
  ticketId,
  currentStatus,
}: {
  ticketId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const st = useTranslations("Subscription.status");

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);
    const result = await updateTicketStatus(ticketId, newStatus);
    setLoading(false);

    if (result.error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={loading}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">{st("active")}</SelectItem>
        <SelectItem value="in_progress">{st("trialing")}</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
        <SelectItem value="closed">{st("canceled")}</SelectItem>
      </SelectContent>
    </Select>
  );
}

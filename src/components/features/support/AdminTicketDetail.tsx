"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateTicketReply } from "@/services/support/admin-actions";

interface Ticket {
  id: string;
  created_at: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  status: string;
  reply?: string;
  replied_at?: string;
}

interface AdminTicketDetailProps {
  ticket: Ticket;
}

export function AdminTicketDetail({ ticket }: AdminTicketDetailProps) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState(ticket.reply || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("Support.form"); // Reusing user form translations or could create Admin specific ones

  const handleReplySubmit = async () => {
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await updateTicketReply(ticket.id, reply);
      if (result.success) {
        setOpen(false);
      } else {
        alert("Failed to send reply"); // Simple error handling
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="View & Reply">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("title") || "Ticket Details"}</DialogTitle>
          <DialogDescription>
            {t("submittedBy") || "Submitted by"} {ticket.email} on{" "}
            {format(new Date(ticket.created_at), "PPP p")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>{t("subject") || "Subject"}</Label>
            <div className="font-medium p-2 bg-muted/50 rounded-md">
              {ticket.subject}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>{t("message") || "Message"}</Label>
            <div className="p-3 bg-muted/50 rounded-md whitespace-pre-wrap text-sm min-h-[100px]">
              {ticket.message}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Badge variant="outline">{ticket.status}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Label>{t("priority") || "Category"}:</Label>
              <Badge variant="secondary">{ticket.category || "General"}</Badge>
            </div>
          </div>

          <div className="grid gap-2 mt-4">
            <Label htmlFor="reply">{t("reply") || "Reply"}</Label>
            <Textarea
              id="reply"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={t("replyPlaceholder") || "Type your reply here..."}
              className="min-h-[150px]"
            />
            {ticket.replied_at && (
              <p className="text-xs text-muted-foreground">
                Last replied: {format(new Date(ticket.replied_at), "PPP p")}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleReplySubmit}
            disabled={isSubmitting || !reply.trim()}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("submitReply") || "Send Reply & Resolve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

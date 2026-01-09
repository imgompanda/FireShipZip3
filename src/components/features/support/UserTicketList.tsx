"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface Ticket {
  id: string;
  created_at: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  category: string;
  reply?: string;
  replied_at?: string;
}

interface UserTicketListProps {
  tickets: Ticket[];
}

export function UserTicketList({ tickets }: UserTicketListProps) {
  const t = useTranslations("Support");

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "default"; // or check if you have a success variant
      case "in_progress":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "destructive"; // Open
    }
  };

  const getStatusLabel = (status: string) => {
    // Fallback if specific translations don't exist yet
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          {t("noTickets", { defaultMessage: "No tickets found." })}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("myTickets", { defaultMessage: "My Tickets" })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            {tickets.map((ticket) => (
              <AccordionItem key={ticket.id} value={ticket.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center justify-between mr-4 text-left">
                    <span className="font-medium truncate max-w-[200px] sm:max-w-md">
                      {ticket.subject}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {format(new Date(ticket.created_at), "yyyy-MM-dd")}
                      </span>
                      <Badge variant={getStatusVariant(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  <div className="space-y-4 pt-2">
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="font-semibold mb-1">Question:</p>
                      <p className="whitespace-pre-wrap">{ticket.message}</p>
                    </div>

                    {ticket.reply && (
                      <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-blue-700 dark:text-blue-300">
                            Answer
                          </p>
                          {ticket.replied_at && (
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(ticket.replied_at!),
                                "yyyy-MM-dd HH:mm"
                              )}
                            </span>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap">{ticket.reply}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

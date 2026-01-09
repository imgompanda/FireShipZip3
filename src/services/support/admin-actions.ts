"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTickets(filters?: {
  q?: string;
  status?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("support_tickets")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters?.q) {
    query = query.or(`email.ilike.%${filters.q}%,subject.ilike.%${filters.q}%`);
  }

  const { data: tickets, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching tickets:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return { data: [], count: 0, totalPages: 0 };
  }

  return {
    data: tickets,
    count: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", ticketId);

  if (error) {
    console.error("Error updating ticket status:", error);
    return { error: "Failed to update status" };
  }

  revalidatePath("/admin/tickets");
  return { success: true };
}

export async function updateTicketReply(ticketId: string, reply: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("support_tickets")
    .update({
      reply,
      replied_at: new Date().toISOString(),
      status: "resolved", // Auto-resolve on reply
    })
    .eq("id", ticketId);

  if (error) {
    console.error("Error updating ticket reply:", error);
    return { error: "Failed to update reply" };
  }

  revalidatePath("/admin/tickets");
  return { success: true };
}

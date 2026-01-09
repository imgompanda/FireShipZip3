"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const ticketSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
  category: z.enum(["billing", "account", "technical", "general"]),
});

export type TicketFormState = {
  error?: string;
  success?: boolean;
};

export async function submitTicket(
  prevState: TicketFormState,
  formData: z.infer<typeof ticketSchema>
): Promise<TicketFormState> {
  const supabase = await createClient();

  // 1. Validate input
  const validatedFields = ticketSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields: " + validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, subject, message, category } = validatedFields.data;

  // 2. Get current user (if logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Insert ticket
  const { error } = await supabase.from("support_tickets").insert({
    user_id: user?.id || null,
    email,
    subject,
    message,
    category,
    status: "open",
  });

  if (error) {
    console.error("Ticket Submission Error:", error);
    return { error: "Failed to submit ticket. Please try again." };
  }

  return { success: true };
}

export async function getUserTickets() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

import { NextResponse } from "next/server";
import { resend } from "@/lib/resend/client";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();

    // Send email to admin
    const { error } = await resend.emails.send({
      from: "Feedback <onboarding@resend.dev>", // Change this to your verificated domain in production
      to: process.env.RESEND_FROM_EMAIL || "admin@example.com", // Send to self
      subject: `New Feedback from ${user?.email || "Visitor"}`,
      text: `
User: ${user?.email || "Anonymous"} (${user?.id || "N/A"})
Message:
${message}
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

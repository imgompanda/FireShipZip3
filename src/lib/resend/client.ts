import { Resend } from "resend";

// Explicitly named folder/file to show this is the Resend integration
export const resend = new Resend(process.env.RESEND_API_KEY);

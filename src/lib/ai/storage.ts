import { createClient } from "@/utils/supabase/server";

export async function uploadToSupabase(
  file: Buffer,
  userId: string,
  type: "image" | "video"
): Promise<string | null> {
  const supabase = await createClient();
  const timestamp = Date.now();
  const ext = type === "image" ? "png" : "mp4";
  const path = `ai-generations/${userId}/${type}-${timestamp}.${ext}`;

  const { error } = await supabase.storage
    .from("ai-assets")
    .upload(path, file, {
      contentType: type === "image" ? "image/png" : "video/mp4",
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from("ai-assets").getPublicUrl(path);
  return data.publicUrl;
}

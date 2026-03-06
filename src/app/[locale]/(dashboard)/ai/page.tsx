import { AILayout } from "@/components/ai";

export default function AIPage() {
  const videoEnabled = !!process.env.FAL_API_KEY;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-base-content">AI Studio</h1>
        <p className="text-base-content/60 mt-1">
          Chat, generate images, and create videos with AI
        </p>
      </div>
      <AILayout videoEnabled={videoEnabled} />
    </div>
  );
}

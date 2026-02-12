import { generateText } from "ai";
import { turboMoonshot } from "@/ai/model";

export async function generateConversationTitle(message: string): Promise<string> {
  const { text } = await generateText({
    model: turboMoonshot,
    prompt: `Generate a short conversation title (max 6 words) for a chat that starts with this message. Return ONLY the title, nothing else.\n\nMessage: ${message}`,
  });

  return text.trim();
}

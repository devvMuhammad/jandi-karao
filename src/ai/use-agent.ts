import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import { codingAgent } from "./agent";

const transport = new DirectChatTransport({ agent: codingAgent });

export function useAgent() {
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const append = async (content: string) => {
    await sendMessage({ text: content });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    append,
    isLoading,
    status,
    clearMessages,
  };
}

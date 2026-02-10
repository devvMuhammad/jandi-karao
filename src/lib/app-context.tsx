import { createContext, useContext, useState } from "react";
import { useNavigate } from "./navigation-context";

interface AppContext {
  activeConversationId: string | undefined;
  initialMessage: string | undefined;
  openChat: (conversationId: string, message?: string) => void;
}

const appContext = createContext<AppContext>({
  activeConversationId: undefined,
  initialMessage: undefined,
  openChat: () => { },
});

export function AppProvider({ children }: { children: React.ReactNode }) {

  const { navigate } = useNavigate();
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  function openChat(conversationId: string, message?: string) {
    setActiveConversationId(conversationId);
    if (message) {
      setInitialMessage(message);
    }
    navigate("chat");
  }

  const value: AppContext = {
    activeConversationId,
    initialMessage,
    openChat,
  };



  return <appContext.Provider value={value}>{children}</appContext.Provider>;
}

export function useApp() {
  return useContext(appContext);
}
import { useState, useCallback } from "react";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { HomePage } from "@/components/home-page";
import { ChatPage } from "@/components/chat-page";
import { theme } from "@/lib/theme";
import { createConversation } from "@/lib/storage";
import { NoConversation } from "./components/no-conversation";


type Route = "home" | "chat";

export function App() {
  const [activeRoute, setActiveRoute] = useState<Route>("home");
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  // navigate to chat page, used by home page
  const navigateToChat = (conversationId: string, message?: string) => {
    setActiveConversationId(conversationId);
    setInitialMessage(message);
    setActiveRoute("chat");
  };

  // navigating to home page, used by chat page and no conversation page
  const navigateToHome = () => {
    setActiveConversationId(undefined);
    setActiveRoute("home");
  };

  const handleNewConversation = useCallback(() => {
    // const conv = createConversation();
    // setActiveConversationId(conv.id);
  }, []);

  return (
    <box backgroundColor={theme.bg} height="100%">
      {activeRoute === "home" && <HomePage onNavigateToChat={navigateToChat} />}
      {activeRoute === "chat" && (
        activeConversationId ? (
          <ChatPage
            conversationId={activeConversationId}
            initialMessage={initialMessage}
            onNavigateHome={navigateToHome}
            onNewConversation={handleNewConversation}
          />
        ) : (
          <NoConversation onGoHome={navigateToHome} />
        )
      )}
    </box>
  );
}

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
});

createRoot(renderer).render(<App />);

import React, { useState } from "react";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { HomePage } from "@/components/home-page";
import { ChatPage } from "@/components/chat-page";
import { theme } from "@/lib/theme";

type Route = "home" | "chat";

export function App() {
  const [activeRoute, setActiveRoute] = useState<Route>("chat");
  const [initialMessage, setInitialMessage] = useState("");

  const navigateToChat = (message: string) => {
    setInitialMessage(message);
    setActiveRoute("chat");
  };

  const navigateToHome = () => {
    setInitialMessage("");
    setActiveRoute("home");
  };

  return (
    <box backgroundColor={theme.bg} height="100%">
      {activeRoute === "home" && <HomePage onNavigateToChat={navigateToChat} />}
      {activeRoute === "chat" && (
        <ChatPage
          initialMessage={initialMessage}
          onNavigateHome={navigateToHome}
        />
      )}
    </box>
  );
}

// Initialize renderer and render the app

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
});

createRoot(renderer).render(<App />);

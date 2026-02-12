import { ConsolePosition, createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { HomePage } from "@/components/home-page";
import { ChatPage } from "@/components/chat-page";
import { NoConversation } from "@/components/no-conversation";
import { SessionsPage } from "@/components/sessions-page";
import { HelpPage } from "@/components/help-page";
import { theme } from "@/lib/theme";
import { NavigationProvider, useNavigate } from "@/lib/navigation-context";
import { AppProvider, useApp } from "@/lib/app-context";

function Router() {
  const { route } = useNavigate();
  const { activeConversationId } = useApp();

  return (
    <>
      {route === "home" && <HomePage />}
      {route === "sessions" && <SessionsPage />}
      {route === "help" && <HelpPage />}
      {route === "chat" && (
        activeConversationId ? <ChatPage /> : <NoConversation />
      )}
    </>
  );
}

export function App() {
  return (
    <NavigationProvider>
      <AppProvider>
        <box backgroundColor={theme.bg} height="100%">
          <Router />
        </box>
      </AppProvider>
    </NavigationProvider>
  );
}

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
  consoleOptions: { "position": ConsolePosition.BOTTOM, sizePercent: 30 }
});

createRoot(renderer).render(<App />);

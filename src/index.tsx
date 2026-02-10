import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { HomePage } from "@/components/home-page";
import { ChatPage } from "@/components/chat-page";
import { NoConversation } from "@/components/no-conversation";
import { theme } from "@/lib/theme";
import { NavigationProvider, useNavigate } from "@/lib/navigation-context";
import { AppProvider, useApp } from "@/lib/app-context";

function Router() {
  const { route } = useNavigate();
  const { activeConversationId } = useApp();

  return (
    <>
      {route === "home" && <HomePage />}
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
});

createRoot(renderer).render(<App />);

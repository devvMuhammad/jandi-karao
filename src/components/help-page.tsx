import { useKeyboard } from "@opentui/react";
import { theme } from "@/lib/theme";
import { sharedSyntaxStyle } from "@/lib/syntax-style";
import { useApp } from "@/lib/app-context";
import { useNavigate } from "@/lib/navigation-context";

const helpContent = `
# PHUKLABS — Help

## Commands

| Command      | Description              |
|--------------|--------------------------|
| \`/help\`      | Show this help page      |
| \`/new\`       | Start a new conversation |
| \`/clear\`     | Clear current messages   |
| \`/sessions\`  | View all conversations   |
| \`/home\`      | Go back to home          |
| \`/back\`      | Go back to home          |
| \`/exit\`      | Exit the application     |
| \`/quit\`      | Exit the application     |

## Keyboard Shortcuts

| Key              | Action                          |
|------------------|---------------------------------|
| \`Enter\`          | Send message                    |
| \`Shift+Enter\`    | New line in input               |
| \`Escape\`         | Go back / close                 |
| \`↑ / ↓\`          | Navigate command menu           |
| \`Tab\`            | Select command from menu        |
| \`Ctrl+C\`         | Exit the application            |

## Tips

- Start typing \`/\` to open the **command menu** with autocomplete.
- Use \`/sessions\` to browse and search through past conversations.
- Press \`Ctrl+D\` in the sessions page to delete a conversation.
- Conversations are **auto-titled** based on your first message.
`.trim();

export function HelpPage() {
  const { activeConversationId } = useApp();
  const { navigate } = useNavigate();

  useKeyboard((e) => {
    if (e.name === "escape") {
      if (activeConversationId) {
        navigate("chat");
      } else {
        navigate("home");
      }
    }
  });

  return (
    <box flexDirection="column" height="100%" backgroundColor={theme.bg}>
      {/* Header */}
      <box
        flexDirection="row"
        justifyContent="space-between"
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        flexShrink={0}
      >
        <text fg={theme.accent}>Help</text>
        <text fg={theme.textDim}>esc to go back</text>
      </box>

      {/* Help Content */}
      <scrollbox flexGrow={1} paddingLeft={2} paddingRight={2}>
        <markdown
          content={helpContent}
          syntaxStyle={sharedSyntaxStyle}
        />
      </scrollbox>
    </box>
  );
}

import { useMemo } from "react";
import figlet from "figlet";
import { theme } from "@/lib/theme";
import { createConversation } from "@/lib/storage";
import { InputPrompt } from "@/components/input-prompt";
import { useApp } from "@/lib/app-context";
import type { CommandContext } from "@/lib/commands";

const asciiArt = figlet.textSync("PHUKLABS", { font: "ANSI Shadow" });

export function HomePage() {
  const { openChat } = useApp();

  const handleSubmit = async (value: string) => {
    const conv = createConversation();
    openChat(conv.id, value);
  };

  const commandContext: CommandContext = useMemo(
    () => ({
      clearMessages: () => { },
      clearInput: () => { },
      navigateHome: () => { },
      newConversation: () => { },
      exit: () => process.exit(0),
    }),
    [],
  );

  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      backgroundColor={theme.bg}
    >
      {/* ASCII Banner */}
      <box flexDirection="column" alignItems="center" marginBottom={1}>
        {asciiArt.split("\n").map((line, i) => (
          <text key={i} fg={theme.accent}>
            {line}
          </text>
        ))}
      </box>

      {/* Subtitle */}
      <text fg={theme.textDim} marginBottom={2}>
        YOUR TIME IS IMPORTANT, SPEND IT ON SOMETHING ELSE
      </text>

      {/* Input Prompt with Command Menu */}
      <InputPrompt
        commandContext={commandContext}
        onSubmit={handleSubmit}
        placeholder="Ask anything... (type / for commands)"
        width={80}
      />

      {/* Help hint */}
      <text fg={theme.textDim} marginTop={2}>
        Press Enter to send, type /exit to quit
      </text>
    </box>
  );
}

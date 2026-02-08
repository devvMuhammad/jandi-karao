import { theme } from "@/lib/theme";
import { useKeyboard } from "@opentui/react";
import figlet from "figlet";

const lostAsciiArt = figlet.textSync("LOST ?", { font: "ANSI Shadow" });

export function NoConversation({ onGoHome }: { onGoHome: () => void }) {
  useKeyboard((key) => {
    if (key.name === "return") onGoHome();
  });

  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <box flexDirection="column" alignItems="center" marginBottom={1}>
        {lostAsciiArt.split("\n").map((line, i) => (
          <text key={i} fg={theme.accent}>
            {line}
          </text>
        ))}
      </box>
      <text fg={theme.textDim}>No conversation found — press enter to go back</text>
    </box>
  );
}

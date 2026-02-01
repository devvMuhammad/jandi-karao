import { useState, useRef, useEffect } from "react";
import figlet from "figlet";
import { theme } from "../lib/theme";
import type { TextareaRenderable } from "@opentui/core";

interface HomePageProps {
  onNavigateToChat: (message: string) => void;
}

const asciiArt = figlet.textSync("PHUKLABS", { font: "ANSI Shadow" });

const commands = [
  { name: "/exit", description: "Exit the application" },
  { name: "/quit", description: "Exit the application" },
  { name: "/clear", description: "Clear conversation" },
  { name: "/help", description: "Show available commands" },
];

export function HomePage({ onNavigateToChat }: HomePageProps) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const [input, setInput] = useState("");
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const showCommandMenu = input.startsWith("/");
  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(input.toLowerCase()),
  );

  // Reset selected index when filtered commands change
  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [input]);

  const handleSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Handle commands
    if (trimmed === "/exit" || trimmed === "/quit") {
      process.exit(0);
      return;
    }

    if (trimmed === "/clear") {
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.setText("");
      }
      return;
    }

    if (trimmed === "/help") {
      // For now, just clear the input
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.setText("");
      }
      return;
    }

    // Navigate to chat with the message
    onNavigateToChat(trimmed);
  };

  const handleKeyDown = (e: {
    name: string;
    shift?: boolean;
    preventDefault: () => void;
  }) => {
    // Submit on Enter (without Shift for newline)
    if (e.name === "return" && !e.shift) {
      e.preventDefault();
      if (showCommandMenu && filteredCommands.length > 0) {
        // If command menu is showing, submit the selected command
        const selectedCommand = filteredCommands[selectedCommandIndex];
        if (selectedCommand) {
          handleSubmit(selectedCommand.name);
        }
      } else {
        handleSubmit(input);
      }
      // Clear textarea after submit
      if (textareaRef.current) {
        textareaRef.current.setText("");
      }
      setInput("");
      return;
    }

    // Command menu navigation (only when menu is visible)
    if (!showCommandMenu || filteredCommands.length === 0) return;

    if (e.name === "up") {
      e.preventDefault();
      setSelectedCommandIndex((prev) =>
        prev <= 0 ? filteredCommands.length - 1 : prev - 1,
      );
    } else if (e.name === "down") {
      e.preventDefault();
      setSelectedCommandIndex((prev) =>
        prev >= filteredCommands.length - 1 ? 0 : prev + 1,
      );
    } else if (e.name === "tab") {
      e.preventDefault();
      // Auto-complete the selected command
      const selectedCommand = filteredCommands[selectedCommandIndex];
      textareaRef?.current?.setText(selectedCommand.name);
      setInput(selectedCommand.name);
    }
  };

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

      {/* Command Menu (shown when input starts with /) */}
      {showCommandMenu &&
        (filteredCommands.length > 0 ? (
          <box
            flexDirection="column"
            width={80}
            marginBottom={1}
            border={true}
            borderColor={theme.border}
            backgroundColor={theme.bgHighlight}
          >
            {filteredCommands.map((cmd, index) => (
              <box
                key={cmd.name}
                flexDirection="row"
                justifyContent="space-between"
                paddingLeft={1}
                paddingRight={1}
                backgroundColor={
                  index === selectedCommandIndex
                    ? theme.bgSelected
                    : theme.bgHighlight
                }
              >
                <text
                  fg={
                    index === selectedCommandIndex
                      ? theme.textInverse
                      : theme.text
                  }
                >
                  {cmd.name}
                </text>
                <text
                  fg={
                    index === selectedCommandIndex
                      ? theme.textInverse
                      : theme.textDim
                  }
                >
                  {cmd.description}
                </text>
              </box>
            ))}
          </box>
        ) : (
          <box>
            <text
              fg={theme.text}
              bg={theme.bgHighlight}
              padding={1}
              paddingLeft={2}
              paddingRight={2}
            >
              No commands found
            </text>
          </box>
        ))}

      {/* Input Box - following OpenCode's pattern */}
      <box width={80} flexShrink={0}>
        <box border={["left"]} borderColor={theme.borderFocused}>
          <box
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            flexShrink={0}
            backgroundColor={theme.bgHighlight}
            flexGrow={1}
          >
            <textarea
              ref={textareaRef}
              minHeight={1}
              maxHeight={4}
              textColor={theme.text}
              focusedTextColor={theme.text}
              focusedBackgroundColor={theme.bgHighlight}
              placeholder="Ask anything... (type / for commands)"
              focused={true}
              onContentChange={() => {
                const value = textareaRef.current?.plainText ?? "";
                setInput(value);
              }}
              onKeyDown={handleKeyDown}
            />
          </box>
        </box>
      </box>

      {/* Help hint */}
      <text fg={theme.textDim} marginTop={1}>
        Press Enter to send, type /exit to quit
      </text>
    </box>
  );
}

import { useState, useRef, useMemo } from "react";
import figlet from "figlet";
import { theme } from "@/lib/theme";
import { createConversation } from "@/lib/storage";
import { CommandMenu } from "@/components/command-menu";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useInputBoxLayout } from "@/hooks/use-input-box-layout";
import type { CommandContext } from "@/lib/commands";
import type { TextareaRenderable, BoxRenderable } from "@opentui/core";

interface HomePageProps {
  onNavigateToChat: (message: string, conversationId: string) => void;
}

const asciiArt = figlet.textSync("PHUKLABS", { font: "ANSI Shadow" });

export function HomePage({ onNavigateToChat }: HomePageProps) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const inputBoxRef = useRef<BoxRenderable>(null);

  const [input, setInput] = useState("");

  const inputBoxLayout = useInputBoxLayout(inputBoxRef);

  const handleSubmit = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setInput("");
    textareaRef.current?.setText("");

    const conv = createConversation();
    onNavigateToChat(trimmed, conv.id);
  };

  const commandContext: CommandContext = useMemo(
    () => ({
      clearMessages: () => { },
      clearInput: () => {
        textareaRef.current?.setText("");
        setInput("");
      },
      navigateHome: () => { },
      newConversation: () => { },
      exit: () => process.exit(0),
    }),
    [],
  );

  const { isVisible, filteredCommands, selectedIndex, handleKeyDown } =
    useCommandMenu({
      input,
      context: commandContext,
      onSubmitMessage: handleSubmit,
    });

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

      {/* Command Menu - Absolutely positioned above the input */}

      <CommandMenu
        commands={filteredCommands}
        selectedIndex={selectedIndex}
        inputBoxLayout={inputBoxLayout}
        isVisible={isVisible}
      />

      {/* Input Box */}
      <box ref={inputBoxRef} width={80} flexShrink={0}>
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

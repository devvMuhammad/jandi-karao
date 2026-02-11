import { useState, useRef, useMemo } from "react";
import { theme } from "@/lib/theme";
import { CommandMenu } from "@/components/command-menu";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useInputBoxLayout } from "@/hooks/use-input-box-layout";
import { type CommandContext } from "@/lib/commands";
import type { TextareaRenderable, BoxRenderable } from "@opentui/core";

interface InputPromptProps {
  commandContext: CommandContext;
  onSubmit: (value: string) => Promise<void>;
  placeholder?: string;
  width?: number;
}

export function InputPrompt({
  commandContext,
  onSubmit,
  placeholder,
  width,
}: InputPromptProps) {
  const textareaRef = useRef<TextareaRenderable>(null);
  const inputBoxRef = useRef<BoxRenderable>(null);

  const [input, setInput] = useState("");

  const inputBoxLayout = useInputBoxLayout(inputBoxRef);

  // implement clear input command that was not implemented in the parent 
  const contextWithClearInput: CommandContext = useMemo(
    () => ({
      ...commandContext,
      clearInput: () => {
        textareaRef.current?.setText("");
        setInput("");
      },
    }),
    [commandContext],
  );

  const handleSubmit = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setInput("");
    textareaRef.current?.clear();

    await onSubmit(trimmed);
  };

  const { isVisible, filteredCommands, selectedIndex, handleKeyDown } =
    useCommandMenu({
      input,
      context: contextWithClearInput,
      onSubmitMessage: handleSubmit,
    });

  return (
    <>
      <CommandMenu
        commands={filteredCommands}
        selectedIndex={selectedIndex}
        inputBoxLayout={inputBoxLayout}
        isVisible={isVisible}
      />

      <box ref={inputBoxRef} width={width} flexShrink={0} marginTop={1}>
        <box border={["left"]} borderColor={theme.borderFocused} flexShrink={0}>
          <box
            paddingLeft={width ? 2 : 1}
            paddingRight={width ? 2 : 2}
            paddingTop={1}
            paddingBottom={1}
            flexShrink={0}
            backgroundColor={theme.bgHighlight}
            flexGrow={1}
          >
            <textarea
              flexShrink={0}
              ref={textareaRef}
              minHeight={1}
              maxHeight={4}
              textColor={theme.text}
              focusedTextColor={theme.text}
              focusedBackgroundColor={theme.bgHighlight}
              placeholder={placeholder}
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
    </>
  );
}

import { useState, useRef, useMemo, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import { theme } from "@/lib/theme"
import { codingAgent } from "@/ai/agent";
import { ToolResultDisplay } from "@/components/tool-result-display";
import { CommandMenu } from "@/components/command-menu";
import { useCommandMenu } from "@/hooks/use-command-menu";
import { useInputBoxTopPosition } from "@/hooks/use-input-box-top-position";
import type { CommandContext } from "@/lib/commands";
import type {
  TextareaRenderable,
  ScrollBoxRenderable,
  BoxRenderable,
} from "@opentui/core";


interface ChatPageProps {
  initialMessage: string;
  onNavigateHome: () => void;
}


const transport = new DirectChatTransport({ agent: codingAgent });

export function ChatPage({ onNavigateHome }: ChatPageProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const chatTextareaRef = useRef<TextareaRenderable>(null);
  const inputBoxRef = useRef<BoxRenderable>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const [input, setInput] = useState("");
  const inputBoxTop = useInputBoxTopPosition(inputBoxRef);

  const handleChatSubmit = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Clear input and send to agent
    setInput("");
    chatTextareaRef.current?.setText("");

    await sendMessage({ text: trimmed });

    // Scroll to bottom after adding messages
    setTimeout(() => {
      scrollRef.current?.scrollTo(Infinity);
    }, 50);
  };

  const commandContext: CommandContext = useMemo(
    () => ({
      clearMessages: () => setMessages([]),
      clearInput: () => {
        chatTextareaRef.current?.setText("");
        setInput("");
      },
      navigateHome: onNavigateHome,
      exit: () => process.exit(0),
    }),
    [setMessages, onNavigateHome],
  );

  const { isVisible, filteredCommands, selectedIndex, handleKeyDown } =
    useCommandMenu({
      input,
      context: commandContext,
      onSubmitMessage: handleChatSubmit,
    });

  return (
    <box flexDirection="column" height="100%" backgroundColor={theme.bg}>
      {/* Fixed Header - with left border accent */}
      <box flexShrink={0}>
        <box border={["left"]} borderColor={theme.accentSecondary}>
          <box
            flexDirection="row"
            justifyContent="space-between"
            paddingLeft={1}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            backgroundColor={theme.bgHighlight}
          >
            <text fg={theme.accentSecondary}># Conversation</text>
            <text fg={theme.textDim}>tokens: 0 | cost: $0.00</text>
          </box>
        </box>
      </box>

      {/* Scrollable Content Area */}
      <scrollbox
        ref={scrollRef}
        flexGrow={1}
        backgroundColor={theme.bg}
        marginTop={0}
        stickyScroll={true}
      >
        {messages.map((message) =>
          message.role === "user" ? (
            <box
              key={message.id}
              border={true}
              borderColor={theme.borderFocused}
              paddingLeft={1}
            >
              <text fg={theme.text}>{message.parts.filter((p) => p.type === "text").map((p) => p.text).join("")}</text>
            </box>
          ) : (
            <box key={message.id} flexDirection="column" paddingLeft={1}>
              {message.parts.map((part) => {
                if (part.type === "tool-read_file" || part.type === "tool-write_file") {
                  return <ToolResultDisplay key={part.toolCallId} toolCall={part} />
                }

                if (part.type === "text") {
                  return <text key={part.type} fg={theme.text}>{part.text}</text>
                }

                if (part.type === "reasoning") {
                  return <text key={part.type} fg={theme.textDim}>{part.text}</text>
                }

              })}
            </box>
          ),
        )}
        {/* Loading indicator */}
        {isLoading && (
          <box paddingLeft={1}>
            <text fg={theme.accentDim}>Thinking...</text>
          </box>
        )}
      </scrollbox>

      {/* Command Menu - Absolutely positioned above the input */}
      <CommandMenu
        commands={filteredCommands}
        selectedIndex={selectedIndex}
        inputBoxTop={inputBoxTop}
        isVisible={isVisible}
      />

      {/* Fixed Footer with Input */}
      <box ref={inputBoxRef} flexShrink={0} marginTop={1}>
        <box border={["left"]} borderColor={theme.borderFocused}>
          <box
            paddingLeft={1}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            backgroundColor={theme.bgHighlight}
          >
            <textarea
              ref={chatTextareaRef}
              minHeight={1}
              maxHeight={4}
              textColor={theme.text}
              focusedTextColor={theme.text}
              focusedBackgroundColor={theme.bgHighlight}
              placeholder="Type your message... (/exit to quit, /home to go back)"
              focused={true}
              onContentChange={() => {
                const value = chatTextareaRef.current?.plainText ?? "";
                setInput(value);
              }}
              onKeyDown={handleKeyDown}
            />
          </box>
        </box>
      </box>
    </box>
  );
}

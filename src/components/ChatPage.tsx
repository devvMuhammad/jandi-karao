import { useState, useRef, useEffect } from "react";
import { useTerminalDimensions } from "@opentui/react";
import { theme } from "../lib/theme";
import type {
  TextareaRenderable,
  ScrollBoxRenderable,
  BoxRenderable,
  KeyEvent,
} from "@opentui/core";

interface ChatPageProps {
  initialMessage: string;
  onNavigateHome: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const commands = [
  { name: "/exit", description: "Exit the application" },
  { name: "/quit", description: "Exit the application" },
  { name: "/clear", description: "Clear conversation" },
  { name: "/home", description: "Go back to home" },
  { name: "/back", description: "Go back to home" },
  { name: "/help", description: "Show available commands" },
];

export function ChatPage({ initialMessage, onNavigateHome }: ChatPageProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const chatTextareaRef = useRef<TextareaRenderable>(null);
  const inputBoxRef = useRef<BoxRenderable>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFocusedOnInput, setIsFocusedOnInput] = useState(true);
  const [input, setInput] = useState("");
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [inputBoxTop, setInputBoxTop] = useState<number | null>(null);
  const { height: terminalHeight } = useTerminalDimensions();

  // Show command menu only when input is "/" followed by non-space characters (no space allowed)
  const showCommandMenu = /^\/\S*$/.test(input);
  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(input.toLowerCase()),
  );

  // Reset selected index when filtered commands change
  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [input]);

  // Track input box position for command menu positioning
  useEffect(() => {
    const updatePosition = () => {
      if (inputBoxRef.current) {
        setInputBoxTop(inputBoxRef.current.y);
      }
    };
    updatePosition();
    // Update on terminal resize
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [terminalHeight]);

  const handleChatSubmit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Handle commands
    if (trimmed === "/exit" || trimmed === "/quit") {
      process.exit(0);
    }

    if (trimmed === "/home" || trimmed === "/back") {
      onNavigateHome();
      return;
    }

    if (trimmed === "/clear") {
      setMessages([]);
      if (chatTextareaRef.current) {
        chatTextareaRef.current.setText("");
      }
      setInput("");
      return;
    }

    if (trimmed === "/help") {
      // For now, just clear the input
      if (chatTextareaRef.current) {
        chatTextareaRef.current.setText("");
      }
      setInput("");
      return;
    }

    // Add user message and dummy assistant response
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: "user",
        content: trimmed,
      },
      {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "This is a dummy response. AI integration coming soon...",
      },
    ]);

    if (chatTextareaRef.current) {
      chatTextareaRef.current.setText("");
    }
    setInput("");

    // Scroll to bottom after adding messages
    setTimeout(() => {
      scrollRef.current?.scrollTo(Infinity);
    }, 50);
  };

  const handleKeyDown = (e: KeyEvent) => {
    // Submit on Enter (without Shift for newline)
    if (e.name === "return" && !e.shift) {
      e.preventDefault();
      if (showCommandMenu && filteredCommands.length > 0) {
        // If command menu is showing, submit the selected command
        const selectedCommand = filteredCommands[selectedCommandIndex];
        if (selectedCommand) {
          handleChatSubmit(selectedCommand.name);
        }
      } else {
        handleChatSubmit(input);
      }
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
      // Submit the selected command (same as enter)
      const selectedCommand = filteredCommands[selectedCommandIndex];
      if (selectedCommand) {
        handleChatSubmit(selectedCommand.name);
      }
    }
  };

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
      >
        {messages.map((msg) =>
          msg.role === "user" ? (
            <box
              key={msg.id}
              border={true}
              borderColor={theme.borderFocused}
              paddingLeft={1}
            >
              <text fg={theme.text}>{msg.content}</text>
            </box>
          ) : (
            <box key={msg.id} paddingLeft={1}>
              <text fg={theme.textDim}>{msg.content}</text>
            </box>
          ),
        )}
      </scrollbox>

      {/* Command Menu - Absolutely positioned above the input */}
      {showCommandMenu && inputBoxTop !== null && (
        <box
          position="absolute"
          top={
            inputBoxTop -
            (filteredCommands.length > 0 ? filteredCommands.length : 1)
          }
          left={0}
          right={1}
          zIndex={10}
        >
          <box border={["left"]} borderColor={theme.border}>
            <box flexDirection="column" backgroundColor={theme.bgHighlight}>
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, index) => (
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
                ))
              ) : (
                <box paddingLeft={1} paddingRight={1}>
                  <text fg={theme.textDim}>No commands found</text>
                </box>
              )}
            </box>
          </box>
        </box>
      )}

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
              focused={isFocusedOnInput}
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

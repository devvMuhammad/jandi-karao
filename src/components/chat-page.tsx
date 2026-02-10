import { useRef, useMemo, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import { theme } from "@/lib/theme";
import { sharedSyntaxStyle } from "@/lib/syntax-style";
import { codingAgent } from "@/ai/agent";
import { ToolResultDisplay } from "@/components/tool-result-display";
import { InputPrompt } from "@/components/input-prompt";
import { useApp } from "@/lib/app-context";
import { useNavigate } from "@/lib/navigation-context";
import type { CommandContext } from "@/lib/commands";
import type { ScrollBoxRenderable } from "@opentui/core";
import { saveMessage, getMessages } from "@/lib/storage";
import { ThinkingIndicator } from "@/components/thinking-indicator";

const transport = new DirectChatTransport({ agent: codingAgent });

export function ChatPage() {
  const { activeConversationId, initialMessage } = useApp();
  const { navigate } = useNavigate();
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onFinish: ({ message }) => {
      saveMessage(activeConversationId!, {
        id: message.id,
        role: message.role,
        parts: message.parts,
      });
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleChatSubmit = async (value: string) => {
    if (activeConversationId) {
      saveMessage(activeConversationId, {
        role: "user",
        parts: [{ type: "text", text: value }],
      });
    }

    await sendMessage({ text: value });
  };

  // Load existing messages or send initial message for new conversation
  useEffect(() => {
    if (activeConversationId && !initialMessage) {
      // Load existing messages from database
      const storedMessages = getMessages(activeConversationId);
      if (storedMessages.length > 0) {
        setMessages(storedMessages.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          parts: msg.parts,
        })));
      }
    } else if (initialMessage) {
      // New conversation - send the initial message
      handleChatSubmit(initialMessage);
    }
  }, [activeConversationId, initialMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo(Infinity);
  }, [messages.length]);

  const commandContext: CommandContext = useMemo(
    () => ({
      clearMessages: () => setMessages([]),
      clearInput: () => { },
      navigateHome: () => navigate("home"),
      navigateSessions: () => navigate("sessions"),
      newConversation: () => { },
      exit: () => process.exit(0),
    }),
    [setMessages, navigate],
  );

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
              <text
                content={message.parts.filter((p) => p.type === "text").map((p) => p.text).join("")}
              />
            </box>
          ) : (
            <box key={message.id} flexDirection="column" paddingLeft={1} gap={1}>
              {message.parts.map((part, i) => {
                if (part.type.startsWith("tool-")) {
                  return <ToolResultDisplay key={"toolCallId" in part ? part.toolCallId : `${part.type}-${i}`} toolCall={part} />
                }

                if (part.type === "text") {
                  return (
                    <markdown
                      key={`${part.type}-${i}`}
                      content={part.text}
                      syntaxStyle={sharedSyntaxStyle}
                      streaming={true}
                    />
                  );
                }

                if (part.type === "reasoning") {
                  return (
                    <text
                      key={`${part.type}-${i}`}
                      content={part.text}
                      fg={theme.textDim}
                    />
                  );
                }

              })}
            </box>
          ),
        )}
        {isLoading && <ThinkingIndicator />}
      </scrollbox>

      {/* Input Prompt with Command Menu */}
      <box marginTop={1} flexShrink={0}>
        <InputPrompt
          commandContext={commandContext}
          onSubmit={handleChatSubmit}
          placeholder="Type your message... (/exit to quit, /home to go back)"
        />
      </box>
    </box>
  );
}

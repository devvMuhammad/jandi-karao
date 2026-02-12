import { useRef, useMemo, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import { theme } from "@/lib/theme";
import { sharedSyntaxStyle } from "@/lib/syntax-style";
import { codingAgent, MyAgentUIMessage } from "@/ai/agent";
import { generateConversationTitle } from "@/ai/generate-title";
import { ToolResultDisplay } from "@/components/tool-result-display";
import { InputPrompt } from "@/components/input-prompt";
import { useApp } from "@/lib/app-context";
import { useNavigate } from "@/lib/navigation-context";
import type { CommandContext } from "@/lib/commands";
import type { KeyEvent, ScrollBoxRenderable } from "@opentui/core";
import { saveMessage, updateConversationName, getConversation } from "@/lib/storage";
import { ThinkingIndicator } from "@/components/thinking-indicator";
import { useKeyboard } from "@opentui/react";

const transport = new DirectChatTransport({ agent: codingAgent });
export function ChatPage() {
  const { activeConversationId, initialMessage } = useApp();
  const { navigate } = useNavigate();
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const [conversationName, setConversationName] = useState<string | undefined>();
  const { messages, sendMessage, status, setMessages, stop } = useChat<MyAgentUIMessage>({
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

  // Cancel ongoing message with Escape key
  useKeyboard((key: KeyEvent) => {
    if (key.name === "escape" && isLoading) {
      stop();
    }
  });

  const handleChatSubmit = async (value: string, setConversationTitle: boolean = false) => {

    console.log("handleChatSubmit")
    console.log("Active conversation ID:", activeConversationId);
    if (activeConversationId) {
      saveMessage(activeConversationId, {
        role: "user",
        parts: [{ type: "text", text: value }],
      });

      // Generate AI title after the first user message
      if (setConversationTitle) {
        console.log("Generating title...");
        // just generate it, in case of error, just do nothing
        generateConversationTitle(value).then((title) => {
          console.log("Generated title:", title);
          if (activeConversationId) {
            updateConversationName(activeConversationId, title);
          }
          setConversationName(title);
        });
      }
    }

    await sendMessage({ text: value });
  };

  // Load existing messages or send initial message for new conversation
  useEffect(() => {
    if (activeConversationId && !initialMessage) {
      // Load conversation name and existing messages from database
      const conv = getConversation(activeConversationId);
      if (conv) {
        setConversationName(conv.name);
        if (conv.messages.length > 0) {
          setMessages(conv.messages.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            parts: msg.parts,
          })));
        }
      }
    } else if (initialMessage) {
      console.log("Initial message:", initialMessage);
      // New conversation - load name and send the initial message
      handleChatSubmit(initialMessage, true);
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
      navigateHelp: () => navigate("help"),
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
            <text fg={theme.accentSecondary}># {conversationName ?? "Conversation"}</text>
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
      </scrollbox>

      {/* Input Prompt with Command Menu */}
      <InputPrompt
        commandContext={commandContext}
        onSubmit={handleChatSubmit}
        placeholder="Type your message"
      />

      <box flexShrink={0} padding={1} flexDirection="row" justifyContent="space-between">
        <box flexDirection="row" gap={1}>
          {isLoading ? (
            <>
              <ThinkingIndicator />
              <text fg={theme.textDim}>Press ESC to cancel</text>
            </>
          ) : (
            <text fg={theme.textDim}>Press / for commands</text>
          )}
        </box>
        <text fg="#00e5ff">kimi-k2-thinking</text>
      </box>
    </box>
  );
}

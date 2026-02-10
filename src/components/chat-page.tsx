import { useRef, useMemo, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DirectChatTransport } from "ai";
import { theme } from "@/lib/theme";
import { sharedSyntaxStyle } from "@/lib/syntax-style";
import { codingAgent } from "@/ai/agent";
import { ToolResultDisplay } from "@/components/tool-result-display";
import { InputPrompt } from "@/components/input-prompt";
import type { CommandContext } from "@/lib/commands";
import type { ScrollBoxRenderable } from "@opentui/core";
import { saveMessage } from "@/lib/storage";
import { ThinkingIndicator } from "@/components/thinking-indicator";


interface ChatPageProps {
  conversationId: string;
  initialMessage?: string;
  onNavigateHome: () => void;
  onNewConversation: () => void;
}


const transport = new DirectChatTransport({ agent: codingAgent });

export function ChatPage({ conversationId, initialMessage, onNavigateHome, onNewConversation }: ChatPageProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onFinish: ({ message }) => {
      saveMessage(conversationId, {
        id: message.id,
        role: message.role,
        parts: message.parts,
      });
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleChatSubmit = async (value: string) => {
    // Save user message to DB
    if (conversationId) {
      saveMessage(conversationId, {
        role: "user",
        parts: [{ type: "text", text: value }],
      });
    }

    await sendMessage({ text: value });

    // Scroll to bottom after adding messages
    setTimeout(() => {
      scrollRef.current?.scrollTo(Infinity);
    }, 50);
  };

  useEffect(() => {
    if (initialMessage) {
      handleChatSubmit(initialMessage);
    }
  }, [initialMessage]);

  const commandContext: CommandContext = useMemo(
    () => ({
      clearMessages: () => setMessages([]),
      clearInput: () => { },
      navigateHome: onNavigateHome,
      newConversation: onNewConversation,
      exit: () => process.exit(0),
    }),
    [setMessages, onNavigateHome, onNewConversation],
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
              <markdown
                content={message.parts.filter((p) => p.type === "text").map((p) => p.text).join("")}
                syntaxStyle={sharedSyntaxStyle}
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
                    <markdown
                      key={`${part.type}-${i}`}
                      content={part.text}
                      syntaxStyle={sharedSyntaxStyle}
                      streaming={true}
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

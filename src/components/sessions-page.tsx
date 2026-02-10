import { useState, useMemo, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { theme } from "@/lib/theme";
import { getAllConversations, getMessages, deleteConversation } from "@/lib/storage";
import type { Conversation } from "@/lib/storage";
import { useApp } from "@/lib/app-context";
import { useNavigate } from "@/lib/navigation-context";

interface ConversationWithTitle extends Conversation {
  title: string;
}

function getConversationTitle(conv: Conversation): string {
  const messages = getMessages(conv.id);
  const firstUserMessage = messages.find((m) => m.role === "user");

  if (firstUserMessage && firstUserMessage.parts[0]?.type === "text") {
    const text = firstUserMessage.parts[0].text;
    return text.length > 50 ? text.slice(0, 50) + "..." : text;
  }

  return "New conversation";
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
}

function groupConversationsByDate(conversations: ConversationWithTitle[]): Map<string, ConversationWithTitle[]> {
  const groups = new Map<string, ConversationWithTitle[]>();

  for (const conv of conversations) {
    const dateKey = formatDate(conv.updated_at);
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(conv);
  }

  return groups;
}

export function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { openChat } = useApp();
  const { navigate } = useNavigate();

  const allConversations = useMemo(() => {
    const convs = getAllConversations();
    return convs.map((conv) => ({
      ...conv,
      title: getConversationTitle(conv),
    }));
  }, []);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return allConversations;
    }

    const query = searchQuery.toLowerCase();
    return allConversations.filter((conv) =>
      conv.title.toLowerCase().includes(query)
    );
  }, [allConversations, searchQuery]);

  const groupedConversations = useMemo(() => {
    return groupConversationsByDate(filteredConversations);
  }, [filteredConversations]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  useKeyboard((e) => {
    const totalItems = filteredConversations.length;

    if (e.name === "down") {
      setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
    } else if (e.name === "up") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.name === "return" && filteredConversations[selectedIndex]) {
      const selectedConv = filteredConversations[selectedIndex];
      openChat(selectedConv.id);
    } else if (e.name === "escape") {
      navigate("home");
    } else if (e.ctrl && e.name === "d" && filteredConversations[selectedIndex]) {
      const selectedConv = filteredConversations[selectedIndex];
      deleteConversation(selectedConv.id);
      // Trigger re-render by navigating to home and back
      navigate("home");
      setTimeout(() => navigate("sessions"), 0);
    }
  });

  return (
    <box
      flexDirection="column"
      height="100%"
      backgroundColor={theme.bg}
    >
      {/* Header */}
      <box
        flexDirection="row"
        justifyContent="space-between"
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        flexShrink={0}
      >
        <text fg={theme.text}>Sessions</text>
        <text fg={theme.textDim}>esc</text>
      </box>

      {/* Search Input */}
      <box paddingLeft={2} paddingRight={2} paddingBottom={1} flexShrink={0}>
        <input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search"
          focused
          backgroundColor={theme.bg}
          textColor={theme.textDim}
          width="100%"
        />
      </box>

      {/* Conversations List */}
      <box flexDirection="column" flexGrow={1} paddingLeft={2} paddingRight={2}>
        <scrollbox height="100%">
          {Array.from(groupedConversations.entries()).map(([dateKey, convs]) => {
            // Calculate the global index for each conversation
            let globalIndex = 0;
            for (const [prevDate, prevConvs] of groupedConversations.entries()) {
              if (prevDate === dateKey) break;
              globalIndex += prevConvs.length;
            }

            return (
              <box key={dateKey} flexDirection="column" marginBottom={1}>
                {/* Date Header */}
                <text fg={theme.accentSecondary} marginBottom={1}>
                  {dateKey}
                </text>

                {/* Conversations in this date group */}
                {convs.map((conv, localIndex) => {
                  const itemIndex = globalIndex + localIndex;
                  const isSelected = itemIndex === selectedIndex;

                  return (
                    <box
                      key={conv.id}
                      flexDirection="row"
                      justifyContent="space-between"
                      backgroundColor={isSelected ? "#d4a574" : theme.bg}
                      paddingLeft={1}
                      paddingRight={1}
                    >
                      <text fg={isSelected ? "#000000" : theme.text}>
                        {conv.title}
                      </text>
                      <text fg={isSelected ? "#000000" : theme.textDim}>
                        {formatTime(conv.updated_at)}
                      </text>
                    </box>
                  );
                })}
              </box>
            );
          })}
        </scrollbox>
      </box>

      {/* Footer with keyboard shortcuts */}
      <box
        flexDirection="row"
        paddingLeft={2}
        paddingRight={2}
        paddingBottom={1}
        flexShrink={0}
      >
        <text fg={theme.textDim}>delete </text>
        <text fg={theme.text}>ctrl+d</text>
        <text fg={theme.textDim}>  rename </text>
        <text fg={theme.text}>ctrl+r</text>
      </box>
    </box>
  );
}

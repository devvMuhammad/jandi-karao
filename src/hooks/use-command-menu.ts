import { useState, useEffect, useCallback } from "react";
import type { KeyEvent } from "@opentui/core";
import { Command, CommandContext, commands } from "@/lib/commands";

interface UseCommandMenuOptions {
  input: string;
  context: CommandContext;
  onSubmitMessage: (message: string) => Promise<void>;
}

interface UseCommandMenuReturn {
  isVisible: boolean;
  filteredCommands: Command[];
  selectedIndex: number;
  handleKeyDown: (e: KeyEvent) => void;
}

function filterCommands(input: string): Command[] {
  return commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(input.toLowerCase()),
  );
}

function isCommandInput(input: string): boolean {
  return /^\/\S*$/.test(input);
}

export function useCommandMenu({
  input,
  context,
  onSubmitMessage,
}: UseCommandMenuOptions): UseCommandMenuReturn {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isVisible = isCommandInput(input);
  const filtered = filterCommands(input);

  // Reset selection when input changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [input]);

  const executeCommand = useCallback(
    (cmd: Command) => {
      cmd.execute(context);
    },
    [context],
  );

  const handleKeyDown = useCallback(
    (e: KeyEvent) => {
      if (e.name === "return" && !e.shift) {
        e.preventDefault();
        if (isVisible && filtered.length > 0) {
          executeCommand(filtered[selectedIndex]);
        } else {
          onSubmitMessage(input);
        }
        return;
      }

      if (!isVisible || filtered.length === 0) return;

      if (e.name === "up") {
        e.preventDefault();
        setSelectedIndex((p) => (p <= 0 ? filtered.length - 1 : p - 1));
      } else if (e.name === "down") {
        e.preventDefault();
        setSelectedIndex((p) => (p >= filtered.length - 1 ? 0 : p + 1));
      } else if (e.name === "tab") {
        e.preventDefault();
        executeCommand(filtered[selectedIndex]);
      }
    },
    [isVisible, filtered, selectedIndex, input, executeCommand, onSubmitMessage],
  );

  return {
    isVisible,
    filteredCommands: filtered,
    selectedIndex,
    handleKeyDown,
  };
}

import type { Command } from "@/lib/commands";
import { theme } from "@/lib/theme";

interface CommandMenuProps {
  commands: Command[];
  selectedIndex: number;
  inputBoxTop: number | null;
  isVisible: boolean;
}

export function CommandMenu({
  commands,
  selectedIndex,
  inputBoxTop,
  isVisible,
}: CommandMenuProps) {
  if (!isVisible || inputBoxTop === null) return null;

  if (commands.length === 0) return null;

  return (
    <box
      position="absolute"
      top={inputBoxTop - commands.length}
      left={0}
      right={1}
      zIndex={10}
    >
      <box border={["left"]} borderColor={theme.border}>
        <box flexDirection="column" backgroundColor={theme.bgHighlight}>
          {commands.map((cmd, index) => (
            <box
              key={cmd.name}
              flexDirection="row"
              justifyContent="space-between"
              paddingLeft={1}
              paddingRight={1}
              backgroundColor={
                index === selectedIndex ? theme.bgSelected : theme.bgHighlight
              }
            >
              <text
                fg={index === selectedIndex ? theme.textInverse : theme.text}
              >
                {cmd.name}
              </text>
              <text
                fg={
                  index === selectedIndex ? theme.textInverse : theme.textDim
                }
              >
                {cmd.description}
              </text>
            </box>
          ))}
        </box>
      </box>
    </box>
  );
}

import type { Command } from "@/lib/commands";
import type { InputBoxLayout } from "@/hooks/use-input-box-layout";
import { theme } from "@/lib/theme";

interface CommandMenuProps {
  commands: Command[];
  selectedIndex: number;
  inputBoxLayout: InputBoxLayout;
  isVisible: boolean;
}

export function CommandMenu({
  commands,
  selectedIndex,
  inputBoxLayout,
  isVisible,
}: CommandMenuProps) {
  if (!isVisible || inputBoxLayout.top === null) return null;

  if (commands.length === 0) return null;

  return (
    <box
      position="absolute"
      top={inputBoxLayout.top - commands.length}
      left={inputBoxLayout.left ?? 0}
      width={inputBoxLayout.width ?? undefined}
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

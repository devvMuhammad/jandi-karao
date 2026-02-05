import { theme } from "../lib/theme";
import { MyAgentUIMessage } from "../ai/agent";

interface ToolResultDisplayProps {
  toolCall: MyAgentUIMessage['parts'][number];
}

export function ToolResultDisplay({ toolCall }: ToolResultDisplayProps) {


  const toolName = toolCall.type;

  if (toolName === "tool-read_file") {

    if (toolCall.state === "input-streaming") {
      return (
        <box paddingLeft={3}>
          <text fg={theme.textDim}>Reading {toolCall.input!.path}...</text>
        </box>
      );
    }

    if (toolCall.state === "output-available") {
      const output = toolCall.output
      const borderColor = output.success ? theme.accentTertiary : theme.accent;
      const icon = output.success ? "📖" : "❌";
      return (
        <box
          border={["left"]}
          borderColor={borderColor}
          paddingLeft={1}
          marginBottom={1}
        >
          <box flexDirection="column">
            <text fg={borderColor}>
              <strong>{icon} read_file:</strong>{" "}
              <span fg={theme.text}>{toolCall.input!.path}</span>
            </text>
            {output.success ? (
              <box flexDirection="column" paddingLeft={3}>
                <text fg={theme.textDim}>
                  ✓ {output.size} bytes, {output.lines} lines
                </text>
                {output.content && (
                  <box paddingTop={1}>
                    <text fg={theme.text}>{output.content}</text>
                  </box>
                )}
              </box>
            ) : (
              <box paddingLeft={3}>
                <text fg={theme.accent}>✗ {output.error}</text>
              </box>
            )}
          </box>
        </box>
      );
    }

    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Reading {toolCall.input!.path}...</text>
      </box>
    );
  }

  if (toolName === "tool-write_file") {
    if (toolCall.state === "input-streaming") {
      return (
        <box paddingLeft={3}>
          <text fg={theme.textDim}>Writing {toolCall.input!.path}...</text>
        </box>
      );
    }

    if (toolCall.state === "output-available") {

      const output = toolCall.output
      const borderColor = output.success ? theme.accentTertiary : theme.accent;
      const icon = output.success ? "✏️" : "❌";

      return (
        <box
          border={["left"]}
          borderColor={borderColor}
          paddingLeft={1}
          marginBottom={1}
        >
          <box flexDirection="column">
            <text fg={borderColor}>
              <strong>{icon} write_file:</strong>{" "}
              <span fg={theme.text}>{toolCall.input!.path}</span>
            </text>
            {output.success ? (
              <box paddingLeft={3}>
                <text fg={theme.textDim}>
                  ✓ wrote {output.bytesWritten} bytes, {output.lines} lines to{" "}
                  {output.path}
                </text>
              </box>
            ) : (
              <box paddingLeft={3}>
                <text fg={theme.accent}>✗ {output.error}</text>
              </box>
            )}
          </box>
        </box>
      );
    }

    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Writing {toolCall.input!.path}...</text>
      </box>
    );
  }

  // Generic fallback for unknown tools
  return (
    <box
      border={["left"]}
      borderColor={theme.border}
      paddingLeft={1}
      marginBottom={1}
    >
      <text fg={theme.textDim}>🔧 {toolName}</text>
    </box>
  );
}

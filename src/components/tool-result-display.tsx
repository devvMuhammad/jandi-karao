import { theme } from "@/lib/theme";
import { MyAgentUIMessage } from "@/ai/agent";

interface ToolResultDisplayProps {
  toolCall: MyAgentUIMessage['parts'][number];
}

interface ReadFileResultDisplayProps {
  toolCall: Extract<MyAgentUIMessage['parts'][number], { type: "tool-read_file" }>;
}

function ReadFileResultDisplay({ toolCall }: ReadFileResultDisplayProps) {
  if (toolCall.state === "input-streaming") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Reading {toolCall.input!.path}...</text>
      </box>
    );
  }

  if (toolCall.state === "output-available") {
    const output = toolCall.output;
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
                ✓ {output.data.size} bytes, {output.data.lines} lines
              </text>
              {output.data.content && (
                <box paddingTop={1}>
                  <text fg={theme.text}>{output.data.content}</text>
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

interface WriteFileResultDisplayProps {
  toolCall: Extract<MyAgentUIMessage['parts'][number], { type: "tool-write_file" }>;
}

function WriteFileResultDisplay({ toolCall }: WriteFileResultDisplayProps) {
  if (toolCall.state === "input-streaming") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Writing {toolCall.input!.path}...</text>
      </box>
    );
  }

  if (toolCall.state === "output-available") {
    const output = toolCall.output;
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
                ✓ wrote {output.data.bytesWritten} bytes, {output.data.lines} lines to{" "}
                {output.data.path}
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

export function ToolResultDisplay({ toolCall }: ToolResultDisplayProps) {
  switch (toolCall.type) {
    case "tool-read_file":
      return <ReadFileResultDisplay toolCall={toolCall} />;
    case "tool-write_file":
      return <WriteFileResultDisplay toolCall={toolCall} />;
    default:
      return null;
  }
}

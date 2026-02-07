import { theme } from "@/lib/theme";
import { MyAgentUIMessage } from "@/ai/agent";

interface ToolResultDisplayProps {
  toolCall: MyAgentUIMessage["parts"][number];
}

type ToolPart<T extends string> = Extract<
  MyAgentUIMessage["parts"][number],
  { type: T }
>;

// ---------- read_file ----------

function ReadFileResultDisplay({
  toolCall,
}: {
  toolCall: ToolPart<"tool-read_file">;
}) {
  if (toolCall.state !== "output-available") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Reading {toolCall.input?.path}...</text>
      </box>
    );
  }

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
          <span fg={theme.text}>{toolCall.input?.path}</span>
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

// ---------- write_file ----------

function WriteFileResultDisplay({
  toolCall,
}: {
  toolCall: ToolPart<"tool-write_file">;
}) {
  if (toolCall.state !== "output-available") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Writing {toolCall.input?.path}...</text>
      </box>
    );
  }

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
          <span fg={theme.text}>{toolCall.input?.path}</span>
        </text>
        {output.success ? (
          <box paddingLeft={3}>
            <text fg={theme.textDim}>
              ✓ wrote {output.data.bytesWritten} bytes, {output.data.lines}{" "}
              lines to {output.data.path}
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

// ---------- edit_file ----------

function EditFileResultDisplay({
  toolCall,
}: {
  toolCall: ToolPart<"tool-edit_file">;
}) {
  if (toolCall.state !== "output-available") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>Editing {toolCall.input?.path}...</text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;
  const icon = output.success ? "🔧" : "❌";

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{icon} edit_file:</strong>{" "}
          <span fg={theme.text}>{toolCall.input?.path}</span>
        </text>
        {output.success ? (
          <box paddingLeft={3}>
            <text fg={theme.textDim}>
              ✓ {output.data.replacements} replacement
              {output.data.replacements === 1 ? "" : "s"} made
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

// ---------- bash ----------

function BashResultDisplay({
  toolCall,
}: {
  toolCall: ToolPart<"tool-bash">;
}) {
  if (toolCall.state !== "output-available") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>
          Running `{toolCall.input?.command}`...
        </text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;
  const icon = output.success ? "⚡" : "❌";

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{icon} bash:</strong>{" "}
          <span fg={theme.text}>{toolCall.input?.command}</span>
        </text>
        {output.success ? (
          <box flexDirection="column" paddingLeft={3}>
            <text fg={theme.textDim}>
              ✓ exit code {output.data.exitCode}
            </text>
            {output.data.stdout.trim() && (
              <box paddingTop={1}>
                <text fg={theme.text}>{output.data.stdout.trim()}</text>
              </box>
            )}
            {output.data.stderr.trim() && (
              <box paddingTop={1}>
                <text fg={theme.accent}>{output.data.stderr.trim()}</text>
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

// ---------- grep ----------

function GrepResultDisplay({
  toolCall,
}: {
  toolCall: ToolPart<"tool-grep">;
}) {
  if (toolCall.state !== "output-available") {
    return (
      <box paddingLeft={3}>
        <text fg={theme.textDim}>
          Searching for `{toolCall.input?.pattern}`...
        </text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;
  const icon = output.success ? "🔍" : "❌";

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{icon} grep:</strong>{" "}
          <span fg={theme.text}>/{toolCall.input?.pattern}/</span>
          <span fg={theme.textDim}> in {toolCall.input?.path}</span>
        </text>
        {output.success ? (
          <box flexDirection="column" paddingLeft={3}>
            <text fg={theme.textDim}>
              ✓ {output.data.matchCount} match
              {output.data.matchCount === 1 ? "" : "es"}
            </text>
            {output.data.matches.slice(0, 8).map((m, i) => (
              <text key={i} fg={theme.text}>
                <span fg={theme.textDim}>
                  {m.file}:{m.line}
                </span>{" "}
                {m.content}
              </text>
            ))}
            {output.data.matchCount > 8 && (
              <text fg={theme.textDim}>
                ... and {output.data.matchCount - 8} more
              </text>
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

// ---------- dispatcher ----------

export function ToolResultDisplay({ toolCall }: ToolResultDisplayProps) {
  switch (toolCall.type) {
    case "tool-read_file":
      return <ReadFileResultDisplay toolCall={toolCall} />;
    case "tool-write_file":
      return <WriteFileResultDisplay toolCall={toolCall} />;
    case "tool-edit_file":
      return <EditFileResultDisplay toolCall={toolCall} />;
    case "tool-bash":
      return <BashResultDisplay toolCall={toolCall} />;
    case "tool-grep":
      return <GrepResultDisplay toolCall={toolCall} />;
    default:
      return null;
  }
}

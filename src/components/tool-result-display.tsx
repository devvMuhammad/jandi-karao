import { useState } from "react";
import { theme } from "@/lib/theme";
import { sharedSyntaxStyle } from "@/lib/syntax-style";
import { MyAgentUIMessage } from "@/ai/agent";

const MAX_COLLAPSED_HEIGHT = 6;

function CollapsibleOutput({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: number;
}) {
  const [expanded, setExpanded] = useState(false);

  if (lines <= MAX_COLLAPSED_HEIGHT) {
    return <>{children}</>;
  }

  return (
    <box
      flexDirection="column"
      onMouseDown={() => setExpanded((prev) => !prev)}
    >
      <box
        maxHeight={expanded ? undefined : MAX_COLLAPSED_HEIGHT}
        overflow="hidden"
      >
        {children}
      </box>
      <box paddingTop={0} marginTop={1}>
        <text fg={theme.accent}>
          {expanded ? "▴ Show less" : "▾ Show more"}
        </text>
      </box>
    </box>
  );
}

function getFiletypeFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const extMap: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    md: "markdown",
    py: "python",
    bash: "bash",
    sh: "bash",
    zsh: "bash",
  };
  return extMap[ext] ?? "text";
}

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
        <text fg={theme.textDim}>{`Reading ${toolCall.input?.path}...`}</text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{`▸ read_file: `}</strong>
          <span fg={theme.text}>{toolCall.input?.path}</span>
        </text>
        {output.success ? (
          <box flexDirection="column">
            <box paddingLeft={3}>
              <text fg={theme.textDim}>
                {`+ ${output.data.size} bytes, ${output.data.lines} lines`}
              </text>
            </box>
            {output.data.content && (
              <CollapsibleOutput lines={output.data.lines}>
                <box paddingTop={1} paddingLeft={3}>
                  <code
                    content={output.data.content}
                    filetype={getFiletypeFromPath(toolCall.input?.path ?? "")}
                    syntaxStyle={sharedSyntaxStyle}
                  />
                </box>
              </CollapsibleOutput>
            )}
          </box>
        ) : (
          <box paddingLeft={3}>
            <text fg={theme.accent}>{`x ${output.error}`}</text>
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
        <text fg={theme.textDim}>{`Writing ${toolCall.input?.path}...`}</text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{`▸ write_file: `}</strong>
          <span fg={theme.text}>{toolCall.input?.path}</span>
        </text>
        {output.success ? (
          <box paddingLeft={3}>
            <text fg={theme.textDim}>
              {`+ wrote ${output.data.bytesWritten} bytes, ${output.data.lines} lines to ${output.data.path}`}
            </text>
          </box>
        ) : (
          <box paddingLeft={3}>
            <text fg={theme.accent}>{`x ${output.error}`}</text>
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
        <text fg={theme.textDim}>{`Editing ${toolCall.input?.path}...`}</text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{`▸ edit_file: `}</strong>
          <span fg={theme.text}>{toolCall.input?.path}</span>
        </text>
        {output.success ? (
          <box paddingLeft={3}>
            <text fg={theme.textDim}>
              {`+ ${output.data.replacements} replacement${output.data.replacements === 1 ? "" : "s"} made`}
            </text>
          </box>
        ) : (
          <box paddingLeft={3}>
            <text fg={theme.accent}>{`x ${output.error}`}</text>
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
          {`Running \`${toolCall.input?.command}\`...`}
        </text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{`▸ bash: `}</strong>
          <span fg={theme.text}>{toolCall.input?.command}</span>
        </text>
        {output.success ? (
          <CollapsibleOutput
            lines={
              (output.data.stdout.trim()
                ? output.data.stdout.trim().split("\n").length
                : 0) +
              (output.data.stderr.trim()
                ? output.data.stderr.trim().split("\n").length
                : 0)
            }
          >
            <box flexDirection="column" paddingLeft={3}>
              {output.data.stdout.trim() && (
                <box paddingTop={1}>
                  <code
                    content={output.data.stdout.trim()}
                    filetype="bash"
                    syntaxStyle={sharedSyntaxStyle}
                  />
                </box>
              )}
              {output.data.stderr.trim() && (
                <box paddingTop={1}>
                  <code
                    content={output.data.stderr.trim()}
                    filetype="bash"
                    syntaxStyle={sharedSyntaxStyle}
                    fg={theme.accent}
                  />
                </box>
              )}
            </box>
          </CollapsibleOutput>
        ) : (
          <box paddingLeft={3}>
            <text fg={theme.accent}>{`x ${output.error}`}</text>
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
          {`Searching for \`${toolCall.input?.pattern}\`...`}
        </text>
      </box>
    );
  }

  const output = toolCall.output;
  const borderColor = output.success ? theme.accentTertiary : theme.accent;

  return (
    <box
      border={["left"]}
      borderColor={borderColor}
      paddingLeft={1}
      marginBottom={1}
    >
      <box flexDirection="column">
        <text fg={borderColor}>
          <strong>{`▸ grep: `}</strong>
          <span fg={theme.text}>{`/${toolCall.input?.pattern}/`}</span>
          <span fg={theme.textDim}>{` in ${toolCall.input?.path}`}</span>
        </text>
        {output.success ? (
          <CollapsibleOutput lines={output.data.matchCount + 1}>
            <box flexDirection="column" paddingLeft={3}>
              <text fg={theme.textDim}>
                {`+ ${output.data.matchCount} match${output.data.matchCount === 1 ? "" : "es"}`}
              </text>
              {output.data.matches.map((m, i) => (
                <text key={i} fg={theme.text}>
                  <span fg={theme.textDim}>{`${m.file}:${m.line}`}</span>
                  {` ${m.content}`}
                </text>
              ))}
            </box>
          </CollapsibleOutput>
        ) : (
          <box paddingLeft={3}>
            <text fg={theme.accent}>{`x ${output.error}`}</text>
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

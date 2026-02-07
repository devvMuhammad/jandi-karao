import React from "react";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { theme } from "@/lib/theme";
import { ToolResultDisplay } from "@/components/tool-result-display";

// Mock tool call parts to preview each tool result display.
// Each mock matches the shape of MyAgentUIMessage["parts"][number].

const mockReadFileSuccess = {
  type: "tool-read_file" as const,
  state: "output-available" as const,
  input: { path: "src/lib/theme.ts" },
  output: {
    success: true as const,
    data: {
      path: "src/lib/theme.ts",
      size: 542,
      lines: 24,
      content: `export const theme = {\n  bg: "#1a1b26",\n  text: "white",\n};`,
    },
  },
};

const mockReadFileError = {
  type: "tool-read_file" as const,
  state: "output-available" as const,
  input: { path: "src/missing-file.ts" },
  output: {
    success: false as const,
    error: "File not found: src/missing-file.ts",
  },
};

const mockReadFileLoading = {
  type: "tool-read_file" as const,
  state: "input-streaming" as const,
  input: { path: "src/index.tsx" },
};

const mockWriteFileSuccess = {
  type: "tool-write_file" as const,
  state: "output-available" as const,
  input: { path: "src/new-file.ts", content: "..." },
  output: {
    success: true as const,
    data: { path: "src/new-file.ts", bytesWritten: 1280, lines: 42 },
  },
};

const mockWriteFileError = {
  type: "tool-write_file" as const,
  state: "output-available" as const,
  input: { path: "/etc/readonly.conf", content: "..." },
  output: {
    success: false as const,
    error: "Permission denied: /etc/readonly.conf",
  },
};

const mockEditFileSuccess = {
  type: "tool-edit_file" as const,
  state: "output-available" as const,
  input: {
    path: "src/lib/theme.ts",
    oldString: 'bg: "#1a1b26"',
    newString: 'bg: "#16161e"',
  },
  output: {
    success: true as const,
    data: { path: "src/lib/theme.ts", replacements: 1 },
  },
};

const mockEditFileError = {
  type: "tool-edit_file" as const,
  state: "output-available" as const,
  input: {
    path: "src/lib/theme.ts",
    oldString: "not found string",
    newString: "replacement",
  },
  output: {
    success: false as const,
    error:
      "oldString not found in file. Make sure it matches exactly, including whitespace and indentation.",
  },
};

const mockBashSuccess = {
  type: "tool-bash" as const,
  state: "output-available" as const,
  input: { command: "ls -la src/", timeout: 10000 },
  output: {
    success: true as const,
    data: {
      stdout:
        "total 24\ndrwxr-xr-x  7 user staff  224 Feb  7 10:00 .\n-rw-r--r--  1 user staff  890 Feb  7 10:00 index.tsx\ndrwxr-xr-x  4 user staff  128 Feb  7 10:00 components",
      stderr: "",
      exitCode: 0,
    },
  },
};

const mockBashError = {
  type: "tool-bash" as const,
  state: "output-available" as const,
  input: { command: "cat /nonexistent", timeout: 10000 },
  output: {
    success: false as const,
    error: "Command failed (exit 1):\ncat: /nonexistent: No such file or directory",
  },
};

const mockBashLoading = {
  type: "tool-bash" as const,
  state: "input-streaming" as const,
  input: { command: "bun install", timeout: 10000 },
};

const mockGrepSuccess = {
  type: "tool-grep" as const,
  state: "output-available" as const,
  input: { pattern: "theme", path: "src/", include: "*.ts" },
  output: {
    success: true as const,
    data: {
      pattern: "theme",
      matchCount: 4,
      matches: [
        {
          file: "src/lib/theme.ts",
          line: 1,
          content: 'export const theme = {',
        },
        {
          file: "src/components/chat-page.tsx",
          line: 3,
          content: 'import { theme } from "@/lib/theme";',
        },
        {
          file: "src/components/home-page.tsx",
          line: 5,
          content: 'import { theme } from "@/lib/theme";',
        },
        {
          file: "src/components/tool-result-display.tsx",
          line: 1,
          content: 'import { theme } from "@/lib/theme";',
        },
      ],
    },
  },
};

const mockGrepNoMatches = {
  type: "tool-grep" as const,
  state: "output-available" as const,
  input: { pattern: "nonexistent_var", path: "src/" },
  output: {
    success: true as const,
    data: { pattern: "nonexistent_var", matchCount: 0, matches: [] },
  },
};

// all mocks in display order
const allMocks = [
  { label: "read_file (success)", mock: mockReadFileSuccess },
  { label: "read_file (error)", mock: mockReadFileError },
  { label: "read_file (loading)", mock: mockReadFileLoading },
  { label: "write_file (success)", mock: mockWriteFileSuccess },
  { label: "write_file (error)", mock: mockWriteFileError },
  { label: "edit_file (success)", mock: mockEditFileSuccess },
  { label: "edit_file (error)", mock: mockEditFileError },
  { label: "bash (success)", mock: mockBashSuccess },
  { label: "bash (error)", mock: mockBashError },
  { label: "bash (loading)", mock: mockBashLoading },
  { label: "grep (success)", mock: mockGrepSuccess },
  { label: "grep (no matches)", mock: mockGrepNoMatches },
];

function CheckoutApp() {
  return (
    <box
      flexDirection="column"
      backgroundColor={theme.bg}
      height="100%"
      paddingLeft={2}
      paddingRight={2}
      paddingTop={1}
    >
      <text fg={theme.accent}>
        <strong>Tool Result Display Checkout</strong>
      </text>
      <text fg={theme.textDim}>
        Preview of all tool result states{"\n"}
      </text>

      {allMocks.map(({ label, mock }) => (
        <box key={label} flexDirection="column" marginBottom={1}>
          <text fg={theme.accentSecondary}>
            {"─".repeat(40)} {label}
          </text>
          <ToolResultDisplay toolCall={mock as any} />
        </box>
      ))}
    </box>
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: true });
createRoot(renderer).render(<CheckoutApp />);

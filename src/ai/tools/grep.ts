import { tool } from "ai";
import { z } from "zod";
import { ToolResult } from "./utils";

import description from "./grep.txt";

const grepParams = z.object({
  pattern: z.string().describe("The regex pattern to search for"),
  path: z
    .string()
    .describe("File or directory path to search in"),
  include: z
    .string()
    .optional()
    .describe("Glob pattern to filter files (e.g. '*.ts', '*.{ts,tsx}')"),
});

export type GrepMatch = {
  file: string;
  line: number;
  content: string;
};

export type GrepResult = ToolResult<{
  pattern: string;
  matchCount: number;
  matches: GrepMatch[];
}>;

export const grepTool = tool({
  description,
  inputSchema: grepParams,
  execute: async ({
    pattern,
    path,
    include,
  }: z.infer<typeof grepParams>): Promise<GrepResult> => {
    try {
      const args = ["grep", "-rn", "--color=never"];
      if (include) args.push(`--include=${include}`);
      args.push(pattern, path);

      const proc = Bun.spawn(args, {
        stdout: "pipe",
        stderr: "pipe",
      });
      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();

      const exitCode = await proc.exited;

      if (exitCode === 2) {
        return { success: false, error: `grep error: ${stderr}` };
      }

      // exit code 1 means no matches — not an error
      if (exitCode === 1 || !stdout.trim()) {
        return {
          success: true,
          data: { pattern, matchCount: 0, matches: [] },
        };
      }

      const lines = stdout.trim().split("\n");
      const matches = lines.map((line) => {
        /**
         * grep -rn returns lines in form of
         * filePath:lineNumber:(line that contains the content)
         * this regex splits it into three
         */
        const match = line.match(/^(.+?):(\d+):(.*)$/);
        if (!match) return { file: "", line: 0, content: line };
        return {
          file: match[1],
          line: parseInt(match[2], 10),
          content: match[3],
        };
      });

      return {
        success: true,
        data: {
          pattern,
          matchCount: lines.length,
          matches,
          ...(lines.length > 50
            ? { note: `Showing 50 of ${lines.length} matches` }
            : {}),
        },
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
});

import { tool } from "ai";
import { z } from "zod";
import { ToolResult } from "./utils";

import description from "./read-file.txt";

const readFileParams = z.object({
  path: z.string().describe("Path to the file to read"),
});

export type ReadFileResult = ToolResult<{
  path: string;
  size: number;
  lines: number;
  content: string;
}>;

export const readFileTool = tool({
  description,
  inputSchema: readFileParams,
  execute: async ({ path }: z.infer<typeof readFileParams>): Promise<ReadFileResult> => {
    try {
      const file = Bun.file(path);
      if (!(await file.exists())) {
        return { success: false, error: `File not found: ${path}` };
      }
      const content = await file.text();
      return {
        success: true,
        data: {
          path,
          size: file.size,
          lines: content.split("\n").length,
          content:
            content.length > 2000
              ? content.slice(0, 2000) + "\n... (truncated)"
              : content,
        }
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
});

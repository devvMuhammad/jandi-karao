import { tool } from "ai";
import { z } from "zod";
import { ToolResult } from "./utils";

import description from "./write-file.txt";

const writeFileParams = z.object({
  path: z.string().describe("Path to write the file"),
  content: z.string().describe("Complete file content"),
});

export type WriteFileResult =
  ToolResult<{
    path: string;
    bytesWritten: number;
    lines: number;
  }>;

export const writeFileTool = tool({
  description,
  inputSchema: writeFileParams,
  execute: async ({ path, content }: z.infer<typeof writeFileParams>): Promise<WriteFileResult> => {
    try {
      await Bun.write(path, content);
      return {
        success: true,
        data: {
          path,
          bytesWritten: content.length,
          lines: content.split("\n").length,
        }
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
});

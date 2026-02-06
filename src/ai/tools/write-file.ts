import { tool } from "ai";
import { z } from "zod";
import { ToolResult } from "./utils";

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
  description: "Write content to a file. Creates or overwrites.",
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
      return { success: false, error: String(error) };
    }
  },
});

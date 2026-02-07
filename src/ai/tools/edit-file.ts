import { tool } from "ai";
import { z } from "zod";
import { ToolResult } from "./utils";

import description from "./edit-file.txt";

const editFileParams = z.object({
  path: z.string().describe("Path to the file to edit"),
  oldString: z
    .string()
    .describe("The exact text to find and replace. Must match exactly."),
  newString: z
    .string()
    .describe("The replacement text. Use empty string to delete the match."),
});

export type EditFileResult = ToolResult<{
  path: string;
  replacements: number;
}>;

export const editFileTool = tool({
  description,
  inputSchema: editFileParams,
  execute: async ({
    path,
    oldString,
    newString,
  }: z.infer<typeof editFileParams>): Promise<EditFileResult> => {
    try {
      const file = Bun.file(path);
      if (!(await file.exists())) {
        return { success: false, error: `File not found: ${path}` };
      }

      const content = await file.text();

      if (!content.includes(oldString)) {
        throw new Error(`oldString not found in file. Make sure it matches exactly, including whitespace and indentation.`);
      }

      // number of ocurrences = length of content split by oldString - 1
      const occurrences = content.split(oldString).length - 1;
      if (occurrences > 1) {
        throw new Error(`oldString matches ${occurrences} locations. Provide more surrounding context to make it unique.`);
      }

      // replace with the good ol js function
      const newContent = content.replace(oldString, newString);
      await Bun.write(path, newContent);

      return {
        success: true,
        data: {
          path,
          replacements: 1,
        },
      };
    } catch (error) {

      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
});

import { tool } from "ai";
import { z } from "zod";
import { ToolResult } from "./utils";
import description from "./bash.txt";

const bashParams = z.object({
  command: z.string().describe("The bash command to execute"),
  timeout: z
    .number()
    .optional()
    .default(10000)
    .describe("Timeout in milliseconds (default: 10000)"),
});

export type BashResult = ToolResult<{
  stdout: string;
  stderr: string;
  exitCode: number;
}>;

export const bashTool = tool({
  description,
  inputSchema: bashParams,
  execute: async ({
    command,
    timeout,
  }: z.infer<typeof bashParams>): Promise<BashResult> => {
    try {
      const proc = Bun.spawn(["bash", "-c", command], {
        stdout: "pipe",
        stderr: "pipe",
        env: { ...process.env },
      });

      const timeoutId = setTimeout(() => proc.kill(), timeout);

      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();

      clearTimeout(timeoutId);
      const exitCode = await proc.exited;

      // truncate the output upto 4000
      const truncate = (s: string, max = 2000) =>
        s.length > max ? s.slice(0, max) + "\n... (truncated)" : s;

      if (exitCode !== 0) {
        throw new Error(`Command failed (exit ${exitCode}):\n${truncate(stderr || stdout)}`);
      }

      return { success: true, data: { stdout: truncate(stdout), stderr: truncate(stderr), exitCode } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
});

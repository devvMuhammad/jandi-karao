import { InferAgentUIMessage, ToolLoopAgent, stepCountIs } from "ai";
import { readFileTool, writeFileTool } from "./tools";
import { moonshot } from "./model";

export const codingAgent = new ToolLoopAgent({
  model: moonshot,
  instructions: `You are an expert agentic coding assistant running in a terminal. You help users by reading and writing files directly.

## Tools
- **read_file**: Read file contents - ALWAYS read before modifying
- **write_file**: Write/create files - provide complete contents

## Guidelines
- ALWAYS read a file before modifying it
- Write clean code following existing patterns
- Explain what you're doing
- Report errors clearly
- Never delete files unless asked
- You're running in Bun on macOS`,
  tools: {
    read_file: readFileTool,
    write_file: writeFileTool,
  },
  stopWhen: stepCountIs(10),
});
export type MyAgentUIMessage = InferAgentUIMessage<typeof codingAgent>;


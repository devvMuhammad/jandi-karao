
export interface CommandContext {
  clearMessages: () => void;
  clearInput: () => void;
  navigateHome: () => void;
  exit: () => void;
}


export interface Command {
  name: string;
  description: string;
  execute: (ctx: CommandContext) => void | Promise<void>;
}


export const commands: Command[] = [
  {
    name: "/exit",
    description: "Exit the application",
    execute: (ctx) => ctx.exit(),
  },
  {
    name: "/quit",
    description: "Exit the application",
    execute: (ctx) => ctx.exit(),
  },
  {
    name: "/clear",
    description: "Clear conversation",
    execute: (ctx) => {
      ctx.clearMessages();
      ctx.clearInput();
    },
  },
  {
    name: "/home",
    description: "Go back to home",
    execute: (ctx) => ctx.navigateHome(),
  },
  {
    name: "/back",
    description: "Go back to home",
    execute: (ctx) => ctx.navigateHome(),
  },
  {
    name: "/help",
    description: "Show available commands",
    execute: (ctx) => ctx.clearInput(),
  },
];
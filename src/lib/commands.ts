
export interface CommandContext {
  clearMessages: () => void;
  clearInput: () => void;
  navigateHome: () => void;
  navigateSessions: () => void;
  navigateHelp: () => void;
  newConversation: () => void;
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
    name: "/new",
    description: "Start a new conversation",
    execute: (ctx) => ctx.newConversation(),
  },
  {
    name: "/help",
    description: "Show help & shortcuts",
    execute: (ctx) => ctx.navigateHelp(),
  },
  {
    name: "/sessions",
    description: "View all conversations",
    execute: (ctx) => ctx.navigateSessions(),
  },
];
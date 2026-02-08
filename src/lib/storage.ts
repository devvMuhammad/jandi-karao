import { Database } from "bun:sqlite";
import { join } from "path";
import { homedir } from "os";
import { mkdirSync } from "fs";
import type { MyAgentUIMessage } from "@/ai/agent"

export interface Conversation {
  id: string;
  directory: string;
  created_at: string;
  updated_at: string;
}

export interface StoredMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  parts: MyAgentUIMessage["parts"];
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: StoredMessage[];
}

let db: Database | null = null;

function getDb(): Database {
  if (db) return db;

  const dir = join(homedir(), ".jandi-karao");
  mkdirSync(dir, { recursive: true });

  db = new Database(join(dir, "conversations.db"));
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      directory TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      parts TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_directory ON conversations(directory, updated_at DESC);
  `);

  return db;
}

// Functions

export function createConversation(): Conversation {
  const id = crypto.randomUUID();
  const directory = process.cwd();

  getDb()
    .prepare("INSERT INTO conversations (id, directory) VALUES (?, ?)")
    .run(id, directory);

  return getDb()
    .prepare("SELECT * FROM conversations WHERE id = ?")
    .get(id) as Conversation;
}

export function getConversation(id: string): ConversationWithMessages | null {
  const conv = getDb()
    .prepare("SELECT * FROM conversations WHERE id = ?")
    .get(id) as Conversation | null;

  if (!conv) return null;

  const messages = getMessages(id);

  return { ...conv, messages };
}

export function getAllConversations(directory?: string): Conversation[] {
  const dir = directory ?? process.cwd();

  return getDb()
    .prepare(
      "SELECT * FROM conversations WHERE directory = ? ORDER BY updated_at DESC",
    )
    .all(dir) as Conversation[];
}

export function deleteConversation(id: string): void {
  getDb().prepare("DELETE FROM conversations WHERE id = ?").run(id);
}

export function saveMessage(
  conversationId: string,
  msg: { id?: string; role: string; parts: MyAgentUIMessage["parts"] },
): StoredMessage {
  const id = msg.id ?? crypto.randomUUID();

  getDb()
    .prepare(
      "INSERT INTO messages (id, conversation_id, role, parts) VALUES (?, ?, ?, ?)",
    )
    .run(id, conversationId, msg.role, JSON.stringify(msg.parts));

  getDb()
    .prepare(
      "UPDATE conversations SET updated_at = datetime('now') WHERE id = ?",
    )
    .run(conversationId);

  return getDb()
    .prepare("SELECT * FROM messages WHERE id = ?")
    .get(id) as StoredMessage;
}

export function getMessages(conversationId: string): StoredMessage[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
    )
    .all(conversationId) as Array<Omit<StoredMessage, "parts"> & { parts: string }>;

  return rows.map((row) => ({
    ...row,
    parts: JSON.parse(row.parts),
  }));
}

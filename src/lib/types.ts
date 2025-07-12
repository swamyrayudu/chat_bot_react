export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface ChatHistory {
  sessions: ChatSession[];
  currentSessionId: string | null;
} 
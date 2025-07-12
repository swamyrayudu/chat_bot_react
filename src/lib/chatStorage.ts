import type { ChatHistory, ChatSession, Message } from './types';

const STORAGE_KEY = 'chatbot_history';

// Helper function to generate session titles
export const generateSessionTitle = (firstMessage: string): string => {
  const words = firstMessage.split(' ').slice(0, 5);
  return words.join(' ') + (firstMessage.split(' ').length > 5 ? '...' : '');
};

// Helper function to serialize dates for storage
const serializeSession = (session: ChatSession): any => ({
  ...session,
  createdAt: session.createdAt.toISOString(),
  updatedAt: session.updatedAt.toISOString(),
  messages: session.messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp.toISOString()
  }))
});

// Helper function to deserialize dates from storage
const deserializeSession = (session: any): ChatSession => ({
  ...session,
  createdAt: new Date(session.createdAt),
  updatedAt: new Date(session.updatedAt),
  messages: session.messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }))
});

// Get chat history from localStorage
export const getChatHistory = (): ChatHistory => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { sessions: [], currentSessionId: null };
    }
    
    const parsed = JSON.parse(stored);
    return {
      sessions: parsed.sessions.map(deserializeSession),
      currentSessionId: parsed.currentSessionId
    };
  } catch (error) {
    console.error('Error loading chat history:', error);
    return { sessions: [], currentSessionId: null };
  }
};

// Save chat history to localStorage
export const saveChatHistory = (history: ChatHistory): void => {
  try {
    const serialized = {
      sessions: history.sessions.map(serializeSession),
      currentSessionId: history.currentSessionId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

// Create a new chat session
export const createNewSession = (): ChatSession => {
  const session: ChatSession = {
    id: Date.now().toString(),
    title: 'New Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    messageCount: 0
  };
  
  const history = getChatHistory();
  history.sessions.unshift(session);
  history.currentSessionId = session.id;
  saveChatHistory(history);
  
  return session;
};

// Get current session
export const getCurrentSession = (): ChatSession | null => {
  const history = getChatHistory();
  if (!history.currentSessionId) return null;
  
  return history.sessions.find(s => s.id === history.currentSessionId) || null;
};

// Add message to current session
export const addMessageToSession = (message: Message): void => {
  const history = getChatHistory();
  const sessionIndex = history.sessions.findIndex(s => s.id === history.currentSessionId);
  
  if (sessionIndex === -1) return;
  
  const session = history.sessions[sessionIndex];
  session.messages.push(message);
  session.updatedAt = new Date();
  session.messageCount = session.messages.length;
  
  // Generate title from first user message if it's the first message
  if (session.messages.length === 1 && message.isUser) {
    session.title = generateSessionTitle(message.text);
  }
  
  history.sessions[sessionIndex] = session;
  saveChatHistory(history);
};

// Switch to a different session
export const switchToSession = (sessionId: string): ChatSession | null => {
  const history = getChatHistory();
  const session = history.sessions.find(s => s.id === sessionId);
  
  if (session) {
    history.currentSessionId = sessionId;
    saveChatHistory(history);
    return session;
  }
  
  return null;
};

// Delete a session
export const deleteSession = (sessionId: string): void => {
  const history = getChatHistory();
  history.sessions = history.sessions.filter(s => s.id !== sessionId);
  
  // If we deleted the current session, switch to the first available session
  if (history.currentSessionId === sessionId) {
    history.currentSessionId = history.sessions.length > 0 ? history.sessions[0].id : null;
  }
  
  saveChatHistory(history);
};

// Clear all sessions
export const clearAllSessions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Get session by ID
export const getSessionById = (sessionId: string): ChatSession | null => {
  const history = getChatHistory();
  return history.sessions.find(s => s.id === sessionId) || null;
}; 
import { useState, useEffect, useCallback } from 'react';
import type { Message, ChatSession } from '../lib/types';
import { 
  getChatHistory, 
  getCurrentSession, 
  createNewSession, 
  addMessageToSession,
  switchToSession,
  deleteSession,
  clearAllSessions
} from '../lib/chatStorage';

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const history = getChatHistory();
    setSessions(history.sessions);
    
    if (history.currentSessionId) {
      const session = history.sessions.find(s => s.id === history.currentSessionId);
      setCurrentSession(session || null);
    } else if (history.sessions.length > 0) {
      setCurrentSession(history.sessions[0]);
    } else {
      const newSession = createNewSession();
      setCurrentSession(newSession);
      setSessions([newSession]);
    }
    
    setIsLoading(false);
  }, []);

  // Refresh sessions list
  const refreshSessions = useCallback(() => {
    const history = getChatHistory();
    setSessions(history.sessions);
  }, []);

  // Create new session
  const newSession = useCallback(() => {
    const session = createNewSession();
    setCurrentSession(session);
    refreshSessions();
    return session;
  }, [refreshSessions]);

  // Switch to session
  const switchSession = useCallback((sessionId: string) => {
    const session = switchToSession(sessionId);
    if (session) {
      setCurrentSession(session);
      refreshSessions();
      return session;
    }
    return null;
  }, [refreshSessions]);

  // Add message to current session
  const addMessage = useCallback((message: Message) => {
    if (currentSession) {
      addMessageToSession(message);
      refreshSessions();
      
      // Update current session with new message
      const updatedSession = getCurrentSession();
      if (updatedSession) {
        setCurrentSession(updatedSession);
      }
    }
  }, [currentSession, refreshSessions]);

  // Delete session
  const deleteSessionById = useCallback((sessionId: string) => {
    deleteSession(sessionId);
    refreshSessions();
    
    // If we deleted the current session, switch to first available
    if (currentSession?.id === sessionId) {
      const history = getChatHistory();
      if (history.sessions.length > 0) {
        setCurrentSession(history.sessions[0]);
      } else {
        const newSession = createNewSession();
        setCurrentSession(newSession);
        setSessions([newSession]);
      }
    }
  }, [currentSession, refreshSessions]);

  // Clear all sessions
  const clearAll = useCallback(() => {
    clearAllSessions();
    const newSession = createNewSession();
    setCurrentSession(newSession);
    setSessions([newSession]);
  }, []);

  return {
    sessions,
    currentSession,
    isLoading,
    newSession,
    switchSession,
    addMessage,
    deleteSession: deleteSessionById,
    clearAll,
    refreshSessions
  };
}; 
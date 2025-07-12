import type { ChatHistory } from './types';
import { getChatHistory } from './chatStorage';

// Export chat history as JSON file
export const exportChatHistory = (): void => {
  try {
    const history = getChatHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error exporting chat history:', error);
    throw new Error('Failed to export chat history');
  }
};

// Import chat history from JSON file
export const importChatHistory = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const history: ChatHistory = JSON.parse(content);
        
        // Validate the imported data structure
        if (!history.sessions || !Array.isArray(history.sessions)) {
          throw new Error('Invalid chat history format');
        }
        
        // Convert date strings back to Date objects
        const processedHistory: ChatHistory = {
          sessions: history.sessions.map(session => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          })),
          currentSessionId: history.currentSessionId
        };
        
        // Save to localStorage
        localStorage.setItem('chatbot_history', JSON.stringify(processedHistory));
        resolve();
      } catch (error) {
        console.error('Error importing chat history:', error);
        reject(new Error('Failed to import chat history. Please check the file format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsText(file);
  });
};

// Get chat history statistics
export const getChatStats = () => {
  const history = getChatHistory();
  const totalSessions = history.sessions.length;
  const totalMessages = history.sessions.reduce((sum, session) => sum + session.messageCount, 0);
  const oldestSession = history.sessions.length > 0 
    ? Math.min(...history.sessions.map(s => s.createdAt.getTime()))
    : null;
  
  return {
    totalSessions,
    totalMessages,
    oldestSession: oldestSession ? new Date(oldestSession) : null,
    averageMessagesPerSession: totalSessions > 0 ? Math.round(totalMessages / totalSessions) : 0
  };
}; 
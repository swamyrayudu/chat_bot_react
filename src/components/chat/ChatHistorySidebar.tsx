import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Clock, 
  MoreVertical,
  History,
  X,
  Download,
  Upload
} from "lucide-react";
import { Button } from "../ui/button";
import type { ChatSession } from "../../lib/types";
import { 
  getChatHistory, 
  switchToSession, 
  deleteSession, 
  createNewSession,
  clearAllSessions 
} from "../../lib/chatStorage";
import { exportChatHistory, importChatHistory } from "../../lib/chatExport";
import { cn } from "../../lib/utils";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionChange: (sessionId: string) => void;
  currentSessionId: string | null;
}

export const ChatHistorySidebar = ({ 
  isOpen, 
  onClose, 
  onSessionChange, 
  currentSessionId 
}: ChatHistorySidebarProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const history = getChatHistory();
    setSessions(history.sessions);
  }, [isOpen]);

  const handleNewChat = () => {
    const newSession = createNewSession();
    onSessionChange(newSession.id);
    setSessions(getChatHistory().sessions);
    onClose();
  };

  const handleSessionSelect = (session: ChatSession) => {
    const switchedSession = switchToSession(session.id);
    if (switchedSession) {
      onSessionChange(session.id);
      setSessions(getChatHistory().sessions);
      onClose();
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    setSessions(getChatHistory().sessions);
    setShowDeleteConfirm(null);
    
    // If we deleted the current session, switch to the first available
    if (currentSessionId === sessionId) {
      const history = getChatHistory();
      if (history.sessions.length > 0) {
        onSessionChange(history.sessions[0].id);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      clearAllSessions();
      setSessions([]);
      onClose();
    }
  };

  const handleExport = () => {
    try {
      exportChatHistory();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export chat history');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importChatHistory(file)
        .then(() => {
          setSessions(getChatHistory().sessions);
          alert('Chat history imported successfully!');
        })
        .catch((error) => {
          console.error('Import failed:', error);
          alert(error.message);
        });
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0 lg:z-auto"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Chat History</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="text-slate-400 hover:text-green-400 hover:bg-green-400/10 p-2"
              title="Export chat history"
            >
              <Download className="h-4 w-4" />
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 p-2"
                title="Import chat history"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 p-2"
              title="Clear all chats"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-white/10 p-2 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/40"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">No chat history yet</p>
              <p className="text-slate-500 text-xs mt-1">Start a new conversation to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative p-4 rounded-xl cursor-pointer transition-all duration-200",
                    currentSessionId === session.id
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                      : "bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
                  )}
                  onClick={() => handleSessionSelect(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {session.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-400">
                          {formatDate(session.updatedAt)}
                        </span>
                        <span className="text-xs text-slate-500">
                          • {session.messageCount} messages
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(showDeleteConfirm === session.id ? null : session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 hover:bg-red-400/10 p-1 transition-all duration-200"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Delete confirmation */}
                  {showDeleteConfirm === session.id && (
                    <div className="absolute top-2 right-2 bg-slate-800 border border-white/20 rounded-lg p-2 shadow-xl z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session.id);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}; 
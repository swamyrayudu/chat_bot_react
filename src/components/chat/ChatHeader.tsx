import { Trash2, Bot, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export const ChatHeader = ({ onClearChat, messageCount }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-900/80 to-purple-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/25 animate-float">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent flex items-center gap-2">
            AI Assistant
            <Sparkles className="h-5 w-5 text-purple-400" />
          </h1>
          <p className="text-sm text-slate-300 font-medium">
            {messageCount === 0 ? "Ready to help you" : `${messageCount} messages exchanged`}
          </p>
        </div>
      </div>
      {messageCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearChat}
          className="text-slate-300 hover:text-red-400 border-white/20 hover:border-red-400/50 bg-white/5 hover:bg-red-400/10 transition-all duration-300 backdrop-blur-sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      )}
    </div>
  );
};
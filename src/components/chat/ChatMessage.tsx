import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isUser, timestamp, isTyping = false }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full gap-3",
      isUser ? "justify-end animate-slide-in-right" : "justify-start animate-slide-in-left"
    )}>
      {!isUser && (
        <div className="flex items-start pt-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
            <Bot className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] px-6 py-4 rounded-2xl shadow-xl",
        "transition-all duration-300 ease-in-out",
        isUser 
          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-md border border-blue-500/30" 
          : "bg-gradient-to-br from-slate-800/90 to-slate-700/90 text-slate-100 rounded-bl-md border border-white/10 backdrop-blur-sm"
      )}>
        {isTyping ? (
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-slate-300 font-medium">AI is thinking...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message}</p>
        )}
        <div className={cn(
          "text-xs mt-3 opacity-70 font-medium flex items-center gap-2",
          isUser ? "text-blue-100" : "text-slate-400"
        )}>
          {isUser && <User className="h-3 w-3" />}
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div className="flex items-start pt-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
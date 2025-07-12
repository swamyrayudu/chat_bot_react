import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message..." 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-6">
      <div className="flex-1 relative group">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-14 px-6 rounded-2xl border-0 bg-white/10 backdrop-blur-xl",
            "text-white placeholder:text-slate-400 text-sm font-medium",
            "focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15",
            "transition-all duration-300 ease-in-out",
            "hover:bg-white/15 group-hover:shadow-lg group-hover:shadow-purple-500/20"
          )}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="icon"
        className={cn(
          "h-14 w-14 rounded-2xl shrink-0",
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
          "text-white shadow-xl shadow-purple-500/25",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 hover:animate-pulse-glow",
          "active:scale-95"
        )}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};
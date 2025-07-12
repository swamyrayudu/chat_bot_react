import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

export const ChatHeader = ({ onClearChat, messageCount }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-chat-border bg-background">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Ai Chat Bot</h1>
        <p className="text-sm text-muted-foreground">
          {messageCount === 0 ? "Start a conversation" : `${messageCount} messages`}
        </p>
      </div>
      {messageCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearChat}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
};
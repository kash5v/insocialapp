import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  message: string;
  timestamp: string;
  isSent: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
}

export default function ChatMessage({
  message,
  timestamp,
  isSent,
  isRead = false,
  isDelivered = false,
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} mb-3`}
      data-testid={`message-${isSent ? "sent" : "received"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isSent
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        }`}
      >
        <p className="text-sm break-words" data-testid="message-text">{message}</p>
        <div className={`flex items-center gap-1 mt-1 justify-end`}>
          <span className={`text-[10px] ${isSent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
            {timestamp}
          </span>
          {isSent && (
            <div className="ml-1">
              {isRead ? (
                <CheckCheck className="w-3 h-3 text-primary-foreground/70" data-testid="icon-read" />
              ) : isDelivered ? (
                <CheckCheck className="w-3 h-3 text-primary-foreground/70" data-testid="icon-delivered" />
              ) : (
                <Check className="w-3 h-3 text-primary-foreground/70" data-testid="icon-sent" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

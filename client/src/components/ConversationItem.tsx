import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConversationItemProps {
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export default function ConversationItem({
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
}: ConversationItemProps) {
  return (
    <button
      className="w-full flex items-center gap-3 p-3 hover-elevate active-elevate-2 rounded-lg"
      onClick={() => console.log(`Conversation clicked: ${name}`)}
      data-testid="conversation-item"
    >
      {/* Avatar with Online Status */}
      <div className="relative shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-status-online rounded-full border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-semibold text-sm text-foreground truncate" data-testid="conversation-name">
            {name}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{timestamp}</span>
        </div>
        <p
          className={`text-sm truncate ${
            unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
          }`}
          data-testid="last-message"
        >
          {lastMessage}
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <Badge
          className="bg-primary text-primary-foreground shrink-0 px-2 min-w-[20px] h-5 flex items-center justify-center"
          data-testid="unread-badge"
        >
          {unreadCount}
        </Badge>
      )}
    </button>
  );
}

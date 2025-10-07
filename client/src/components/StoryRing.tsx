import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

interface StoryRingProps {
  username: string;
  avatarUrl?: string;
  hasStory?: boolean;
  isViewed?: boolean;
  isOwnStory?: boolean;
}

export default function StoryRing({ 
  username, 
  avatarUrl, 
  hasStory = true, 
  isViewed = false,
  isOwnStory = false 
}: StoryRingProps) {
  return (
    <button 
      className="flex flex-col items-center gap-1 min-w-[72px]"
      data-testid={`story-${username}`}
    >
      <div className={`
        relative p-0.5 rounded-full transition-all duration-200 hover:scale-105
        ${hasStory && !isViewed ? 'story-ring' : 'story-ring-viewed'}
      `}>
        <div className="bg-background rounded-full p-0.5">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {isOwnStory && (
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
            <Plus className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <span className="text-xs text-foreground font-medium truncate max-w-[72px]">
        {username}
      </span>
    </button>
  );
}

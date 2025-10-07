import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryRingProps {
  username: string;
  avatar?: string;
  hasStory?: boolean;
  isViewed?: boolean;
}

export default function StoryRing({ username, avatar, hasStory = true, isViewed = false }: StoryRingProps) {
  return (
    <button
      className="flex flex-col items-center gap-2 hover-elevate active-elevate-2 p-2 rounded-lg"
      onClick={() => console.log(`Story clicked: ${username}`)}
      data-testid={`story-${username}`}
    >
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-full p-0.5 ${
            hasStory && !isViewed
              ? "bg-gradient-to-tr from-primary via-primary to-destructive"
              : isViewed
              ? "bg-border"
              : "bg-transparent"
          }`}
        >
          <div className="w-full h-full rounded-full bg-background p-0.5">
            <Avatar className="w-full h-full">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <span className="text-xs text-foreground font-medium truncate max-w-[64px]">
        {username}
      </span>
    </button>
  );
}

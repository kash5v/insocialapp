import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface CommunityCardProps {
  name: string;
  handle: string;
  description: string;
  memberCount: number;
  coverImage?: string;
  isJoined?: boolean;
}

export default function CommunityCard({
  name,
  handle,
  description,
  memberCount,
  coverImage,
  isJoined = false,
}: CommunityCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-card-border hover-elevate" data-testid="community-card">
      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
        {coverImage && (
          <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground" data-testid="community-name">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-mono">@{handle}</p>
        </div>

        <p className="text-sm text-foreground line-clamp-2" data-testid="community-description">
          {description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm" data-testid="community-members">
              {memberCount.toLocaleString()} members
            </span>
          </div>
          <Button
            size="sm"
            variant={isJoined ? "outline" : "default"}
            onClick={() => console.log(`${isJoined ? "Leave" : "Join"} ${name}`)}
            data-testid="button-join"
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
}

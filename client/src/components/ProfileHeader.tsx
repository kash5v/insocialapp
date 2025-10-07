import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  avatar?: string;
  bio?: string;
  isVerified?: boolean;
  posts: number;
  followers: number;
  following: number;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  isFriend?: boolean;
}

export default function ProfileHeader({
  displayName,
  username,
  avatar,
  bio,
  isVerified = false,
  posts,
  followers,
  following,
  isOwnProfile = false,
  isFollowing = false,
  isFriend = false,
}: ProfileHeaderProps) {
  return (
    <div className="space-y-4" data-testid="profile-header">
      {/* Avatar and Stats */}
      <div className="flex items-start gap-4 px-4">
        <Avatar className="w-24 h-24" data-testid="profile-avatar">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
            {displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 grid grid-cols-3 gap-4 pt-2">
          <button className="text-center hover-elevate active-elevate-2 p-2 rounded-lg" data-testid="stat-posts">
            <p className="font-bold text-lg text-foreground">{posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </button>
          <button className="text-center hover-elevate active-elevate-2 p-2 rounded-lg" data-testid="stat-followers">
            <p className="font-bold text-lg text-foreground">{followers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </button>
          <button className="text-center hover-elevate active-elevate-2 p-2 rounded-lg" data-testid="stat-following">
            <p className="font-bold text-lg text-foreground">{following.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </button>
        </div>
      </div>

      {/* Name and Bio */}
      <div className="px-4 space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-bold text-xl text-foreground" data-testid="profile-name">
            {displayName}
          </h1>
          {isVerified && (
            <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/10 text-primary px-2 py-0">
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-xs">Verified</span>
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-mono" data-testid="profile-username">
          @{username}
        </p>
        {bio && (
          <p className="text-sm text-foreground pt-1" data-testid="profile-bio">
            {bio}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex gap-2">
        {isOwnProfile ? (
          <Button variant="outline" className="flex-1" data-testid="button-edit-profile">
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant={isFollowing ? "outline" : "default"}
              className="flex-1"
              onClick={() => console.log("Follow clicked")}
              data-testid="button-follow"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              variant={isFriend ? "outline" : "secondary"}
              className="flex-1"
              onClick={() => console.log("Add clicked")}
              data-testid="button-add"
            >
              {isFriend ? "Friends" : "Add"}
            </Button>
            <Button variant="outline" size="icon" data-testid="button-message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

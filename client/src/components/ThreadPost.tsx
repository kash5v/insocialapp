import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ThreadPostProps {
  username: string;
  displayName: string;
  avatar?: string;
  timestamp: string;
  content: string;
  likes: number;
  replies: number;
  reposts: number;
  isReply?: boolean;
}

export default function ThreadPost({
  username,
  displayName,
  avatar,
  timestamp,
  content,
  likes,
  replies,
  reposts,
  isReply = false,
}: ThreadPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div
      className={`flex gap-3 px-4 py-3 hover-elevate ${isReply ? "pl-16" : ""}`}
      data-testid="thread-post"
    >
      {/* Avatar */}
      <Avatar className="w-10 h-10 shrink-0">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm text-foreground truncate" data-testid="thread-username">
              {displayName}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              @{username} · {timestamp}
            </span>
          </div>
          <button className="hover-elevate active-elevate-2 p-1 rounded-full shrink-0" data-testid="thread-menu">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Text Content */}
        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap" data-testid="thread-content">
          {content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-6 mt-3">
          <button
            className="flex items-center gap-1 hover-elevate active-elevate-2 p-1 rounded-full"
            data-testid="thread-reply"
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            {replies > 0 && (
              <span className="text-xs text-muted-foreground">{replies}</span>
            )}
          </button>
          <button
            className="flex items-center gap-1 hover-elevate active-elevate-2 p-1 rounded-full"
            data-testid="thread-repost"
          >
            <Repeat2 className="w-4 h-4 text-muted-foreground" />
            {reposts > 0 && (
              <span className="text-xs text-muted-foreground">{reposts}</span>
            )}
          </button>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover-elevate active-elevate-2 p-1 rounded-full"
            data-testid="thread-like"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
              }`}
            />
            {likeCount > 0 && (
              <span className={`text-xs ${isLiked ? "text-destructive" : "text-muted-foreground"}`}>
                {likeCount}
              </span>
            )}
          </button>
          <button className="hover-elevate active-elevate-2 p-1 rounded-full" data-testid="thread-share">
            <Share className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

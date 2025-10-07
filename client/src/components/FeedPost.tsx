import { Heart, MessageCircle, Send, Bookmark, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface FeedPostProps {
  username: string;
  displayName: string;
  avatar?: string;
  timestamp: string;
  caption?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export default function FeedPost({
  username,
  displayName,
  avatar,
  timestamp,
  caption,
  imageUrl,
  likes,
  comments,
}: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden" data-testid="feed-post">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10" data-testid="post-avatar">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-foreground" data-testid="post-username">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">@{username} · {timestamp}</p>
          </div>
        </div>
        <button className="hover-elevate active-elevate-2 p-2 rounded-full" data-testid="post-menu">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-4 pb-3">
          <p className="text-sm text-foreground" data-testid="post-caption">{caption}</p>
        </div>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="relative max-h-[600px] overflow-hidden">
          <img
            src={imageUrl}
            alt="Post content"
            className="w-full object-cover"
            data-testid="post-image"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="hover-elevate active-elevate-2 p-2 rounded-full -ml-2"
              data-testid="button-like"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isLiked ? "fill-destructive text-destructive" : "text-foreground"
                }`}
              />
            </button>
            <button className="hover-elevate active-elevate-2 p-2 rounded-full" data-testid="button-comment">
              <MessageCircle className="w-6 h-6 text-foreground" />
            </button>
            <button className="hover-elevate active-elevate-2 p-2 rounded-full" data-testid="button-share">
              <Send className="w-6 h-6 text-foreground" />
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="hover-elevate active-elevate-2 p-2 rounded-full"
            data-testid="button-save"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                isSaved ? "fill-primary text-primary" : "text-foreground"
              }`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground" data-testid="post-likes">
            {likeCount.toLocaleString()} likes
          </p>
          {comments > 0 && (
            <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="view-comments">
              View all {comments} comments
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

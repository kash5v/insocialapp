import { Heart, MessageCircle, Send, Bookmark, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface FeedPostProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  timestamp: string;
  caption?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export default function FeedPost({
  username,
  displayName,
  avatarUrl,
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

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/10 animate-fade-in" data-testid="feed-post">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11 ring-2 ring-primary/20" data-testid="post-avatar">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-display font-semibold text-sm text-foreground" data-testid="post-username">
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
          <p className="text-sm text-foreground leading-relaxed" data-testid="post-caption">{caption}</p>
        </div>
      )}

      {/* Image */}
      {imageUrl && (
        <div 
          className="relative max-h-[500px] overflow-hidden"
          onDoubleClick={handleDoubleTap}
        >
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
          <div className="flex items-center gap-5">
            <button
              onClick={handleLike}
              className="hover:scale-110 active:scale-95 transition-transform p-1"
              data-testid="button-like"
            >
              <Heart
                className={`w-7 h-7 transition-all duration-200 ${
                  isLiked ? "fill-red-500 text-red-500 scale-110" : "text-foreground"
                }`}
              />
            </button>
            <button className="hover:scale-110 active:scale-95 transition-transform p-1" data-testid="button-comment">
              <MessageCircle className="w-7 h-7 text-foreground" />
            </button>
            <button className="hover:scale-110 active:scale-95 transition-transform p-1" data-testid="button-share">
              <Send className="w-7 h-7 text-foreground" />
            </button>
          </div>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="hover:scale-110 active:scale-95 transition-transform p-1"
            data-testid="button-save"
          >
            <Bookmark
              className={`w-7 h-7 transition-all duration-200 ${
                isSaved ? "fill-primary text-primary" : "text-foreground"
              }`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground" data-testid="post-likes">
            {likeCount.toLocaleString()} likes
          </p>
          {comments > 0 && (
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="view-comments">
              View all {comments} comments
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

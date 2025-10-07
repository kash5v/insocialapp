import { useState, useEffect, useRef } from "react";
import { X, Heart, Send, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface StoryComment {
  id: string;
  username: string;
  avatarUrl?: string;
  text: string;
  timestamp: string;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string;
  duration?: number;
}

export interface StoryUser {
  username: string;
  avatarUrl?: string;
  stories: Story[];
}

interface StoryViewerProps {
  users: StoryUser[];
  initialUserIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ users, initialUserIndex, onClose }: StoryViewerProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<StoryComment[]>([
    {
      id: "1",
      username: "priya.sharma",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      text: "Amazing! 🔥",
      timestamp: "2m ago",
      isLiked: false,
    },
    {
      id: "2",
      username: "raj.tech",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      text: "Love this!",
      timestamp: "5m ago",
      isLiked: true,
    },
  ]);

  const storyDuration = 5000;
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  const currentUser = users[currentUserIndex];
  const currentStory = currentUser?.stories[currentStoryIndex];
  const totalStories = currentUser?.stories.length || 0;

  const clearTimers = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  };

  const startStory = () => {
    setProgress(0);
    clearTimers();

    if (!isPaused) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (storyDuration / 50));
          if (newProgress >= 100) {
            goToNextStory();
            return 0;
          }
          return newProgress;
        });
      }, 50);
    }
  };

  useEffect(() => {
    startStory();
    return () => clearTimers();
  }, [currentStoryIndex, currentUserIndex, isPaused]);

  const goToNextStory = () => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
      const prevUser = users[currentUserIndex - 1];
      setCurrentStoryIndex(prevUser.stories.length - 1);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const threshold = rect.width / 3;

    if (x < threshold) {
      goToPreviousStory();
    } else if (x > threshold * 2) {
      goToNextStory();
    }
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;

    const newComment: StoryComment = {
      id: Date.now().toString(),
      username: "your.username",
      text: comment,
      timestamp: "Just now",
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setComment("");
  };

  const toggleCommentLike = (id: string) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, isLiked: !c.isLiked } : c
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black" data-testid="story-viewer">
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2">
        {currentUser?.stories.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            data-testid={`progress-bar-${idx}`}
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: idx < currentStoryIndex ? '100%' 
                      : idx === currentStoryIndex ? `${progress}%` 
                      : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-50 px-4 pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-white" data-testid="story-user-avatar">
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback className="bg-primary text-white text-xs">
                {currentUser?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <p className="font-medium text-sm" data-testid="story-username">{currentUser?.username}</p>
              <p className="text-xs opacity-80" data-testid="story-timestamp">{currentStory?.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onMouseLeave={() => setIsPaused(false)}
              data-testid="button-pause"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={onClose}
              data-testid="button-close-story"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleTap}
        data-testid="story-content"
      >
        <img
          src={currentStory?.imageUrl}
          alt="Story"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Comments Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl transition-transform duration-300 ${
          showComments ? 'translate-y-0' : 'translate-y-full'
        }`}
        data-testid="comments-drawer"
      >
        <div className="p-4">
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg mb-4">Comments</h3>
          
          <ScrollArea className="h-64 mb-4">
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3" data-testid={`comment-${c.id}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={c.avatarUrl} />
                    <AvatarFallback className="bg-muted text-xs">
                      {c.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">{c.username}</span>
                      <span className="text-xs text-muted-foreground">{c.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{c.text}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => toggleCommentLike(c.id)}
                    data-testid={`like-comment-${c.id}`}
                  >
                    <Heart className={`w-4 h-4 ${c.isLiked ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Reply Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder={showComments ? "Add a comment..." : "Reply to story..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onFocus={() => setShowComments(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-md"
            data-testid="input-story-reply"
          />
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={handleSendComment}
            disabled={!comment.trim()}
            data-testid="button-send-reply"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

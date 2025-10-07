import { useState, useEffect } from "react";
import { X, Heart, MessageCircle, Share2, MoreVertical, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Short {
  id: number;
  title: string;
  username: string;
  displayName: string;
  thumbnail: string;
  views: string;
  likes: string;
}

interface ShortsPlayerProps {
  shorts: Short[];
  initialIndex: number;
  onClose: () => void;
}

export default function ShortsPlayer({ shorts, initialIndex, onClose }: ShortsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [startY, setStartY] = useState(0);
  const currentShort = shorts[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
      if (e.key === "ArrowDown" && currentIndex < shorts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, shorts.length, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < shorts.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-testid="shorts-player"
    >
      {/* Close Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onClose}
        className="absolute top-4 left-4 z-50 text-white hover:bg-white/20"
        data-testid="button-close-shorts"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Volume Toggle */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
        data-testid="button-volume"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </Button>

      {/* Video Container */}
      <div className="relative h-full w-full flex items-center justify-center">
        <video
          src={currentShort.thumbnail}
          poster={currentShort.thumbnail}
          className="h-full w-auto max-w-full object-contain"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          data-testid={`short-video-${currentShort.id}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

        {/* Info Overlay - Bottom */}
        <div className="absolute bottom-20 left-0 right-0 px-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-white/30">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${currentShort.username}`} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                {currentShort.displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-display font-bold text-base">{currentShort.displayName}</p>
              <p className="text-white/80 text-sm">{currentShort.views} views</p>
            </div>
            <Button 
              size="sm" 
              className="ml-auto bg-white text-black hover:bg-white/90 font-semibold"
              data-testid={`follow-${currentShort.id}`}
            >
              Follow
            </Button>
          </div>
          <p className="text-white text-base">{currentShort.title}</p>
        </div>

        {/* Action Buttons - Right Side */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6">
          <button 
            className="flex flex-col items-center gap-1" 
            data-testid={`like-short-${currentShort.id}`}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover-elevate active-elevate-2">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-sm font-semibold">{currentShort.likes}</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1" 
            data-testid={`comment-short-${currentShort.id}`}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover-elevate active-elevate-2">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-sm font-semibold">248</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1" 
            data-testid={`share-short-${currentShort.id}`}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover-elevate active-elevate-2">
              <Share2 className="w-7 h-7 text-white" />
            </div>
          </button>
          <button 
            className="flex flex-col items-center gap-1" 
            data-testid={`more-short-${currentShort.id}`}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover-elevate active-elevate-2">
              <MoreVertical className="w-7 h-7 text-white" />
            </div>
          </button>
        </div>

        {/* Swipe Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {shorts.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all ${
                idx === currentIndex 
                  ? "w-8 bg-white" 
                  : "w-1 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

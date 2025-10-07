import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Heart, MessageCircle, Share2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import ShortsPlayer from "@/components/ShortsPlayer";
import { useLocation } from "wouter";

export default function Watch() {
  const [, setLocation] = useLocation();
  const [shortsPlayerOpen, setShortsPlayerOpen] = useState(false);
  const [selectedShortIndex, setSelectedShortIndex] = useState(0);
  
  const shortVideos = [
    {
      id: 1,
      title: "Amazing dance performance",
      username: "dancer_priya",
      displayName: "Priya Dance",
      thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop",
      views: "125K",
      likes: "15K",
    },
    {
      id: 2,
      title: "Street food Mumbai",
      username: "foodie_raj",
      displayName: "Raj Foodie",
      thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=600&fit=crop",
      views: "89K",
      likes: "12K",
    },
    {
      id: 3,
      title: "Sunset timelapse",
      username: "nature_lover",
      displayName: "Nature Lover",
      thumbnail: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=600&fit=crop",
      views: "203K",
      likes: "28K",
    },
  ];

  const longVideos = [
    {
      id: 1,
      title: "Travel Vlog: Exploring Rajasthan",
      username: "travel_india",
      displayName: "Travel India",
      thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=450&fit=crop",
      duration: "15:32",
      views: "250K",
    },
    {
      id: 2,
      title: "Cooking Tutorial: Authentic Biryani",
      username: "chef_anjali",
      displayName: "Chef Anjali",
      thumbnail: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=450&fit=crop",
      duration: "12:45",
      views: "180K",
    },
  ];

  const handleShortClick = (index: number) => {
    setSelectedShortIndex(index);
    setShortsPlayerOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
          <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
            <h1 className="font-display font-bold text-2xl gradient-text">Watch</h1>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setLocation("/search")}
                data-testid="button-search"
              >
                <Search className="w-5 h-5" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <Tabs defaultValue="short" className="max-w-2xl mx-auto">
          <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-b">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
              <TabsTrigger 
                value="short" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
                data-testid="tab-short"
              >
                Short
              </TabsTrigger>
              <TabsTrigger 
                value="long" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
                data-testid="tab-long"
              >
                Long
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="short" className="mt-0 p-4 space-y-4">
            {shortVideos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => handleShortClick(index)}
                className="w-full glass rounded-3xl overflow-hidden border border-white/10 hover-elevate active-elevate-2 transition-all"
                data-testid={`short-${video.id}`}
              >
                <div className="relative aspect-[9/16] max-h-[600px] overflow-hidden">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10 ring-2 ring-white/20">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${video.username}`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          {video.displayName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-semibold text-sm">{video.displayName}</p>
                        <p className="text-white/80 text-xs">{video.views} views</p>
                      </div>
                    </div>
                    <p className="text-white text-sm">{video.title}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute right-4 bottom-20 flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white text-xs font-semibold">{video.likes}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="long" className="mt-0 p-4 space-y-4">
            {longVideos.map((video) => (
              <div key={video.id} className="glass rounded-2xl overflow-hidden border border-white/10 hover-elevate active-elevate-2 transition-all" data-testid={`long-${video.id}`}>
                <div className="relative aspect-video">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <button className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </button>
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm">
                    <span className="text-white text-xs font-semibold">{video.duration}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-bold text-foreground mb-2">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${video.username}`} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                        {video.displayName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{video.displayName}</p>
                      <p className="text-xs text-muted-foreground">{video.views} views</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <BottomNavBar />
      </div>

      {/* Full-screen Shorts Player */}
      {shortsPlayerOpen && (
        <ShortsPlayer
          shorts={shortVideos}
          initialIndex={selectedShortIndex}
          onClose={() => setShortsPlayerOpen(false)}
        />
      )}
    </>
  );
}

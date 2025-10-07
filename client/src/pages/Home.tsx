import { useState, useEffect, useRef } from "react";
import { Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import StoryRing from "@/components/StoryRing";
import FeedPost from "@/components/FeedPost";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";

export default function Home() {
  const [activeTab, setActiveTab] = useState("my-feed");
  const [showStories, setShowStories] = useState(true);
  const lastScrollY = useRef(0);
  const [, setLocation] = useLocation();

  const stories = [
    { username: "Your Story", isOwnStory: true, hasStory: false },
    { username: "priya", isViewed: false, avatarUrl: "https://i.pravatar.cc/150?img=1" },
    { username: "raj", isViewed: false, avatarUrl: "https://i.pravatar.cc/150?img=2" },
    { username: "anjali", isViewed: true, avatarUrl: "https://i.pravatar.cc/150?img=3" },
    { username: "arjun", isViewed: false, avatarUrl: "https://i.pravatar.cc/150?img=4" },
    { username: "neha", isViewed: false, avatarUrl: "https://i.pravatar.cc/150?img=5" },
    { username: "vikram", isViewed: false, avatarUrl: "https://i.pravatar.cc/150?img=6" },
  ];

  const myFeedPosts = [
    {
      username: "priya.sharma",
      displayName: "Priya Sharma",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      timestamp: "2h",
      caption: "Beautiful sunset at Marine Drive 🌅 #Mumbai #India",
      imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=800&fit=crop",
      likes: 1234,
      comments: 45,
    },
    {
      username: "raj.tech",
      displayName: "Raj Patel",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      timestamp: "5h",
      caption: "Just launched our new startup! Excited for this journey 🚀",
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=800&fit=crop",
      likes: 892,
      comments: 23,
    },
  ];

  const communities = [
    {
      id: 1,
      name: "Mumbai Foodies",
      members: "12.8K",
      posts: 234,
      description: "Best food spots in Mumbai",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Travel India",
      members: "45.2K",
      posts: 890,
      description: "Explore incredible India",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Tech Enthusiasts",
      members: "28.5K",
      posts: 567,
      description: "Latest tech news & discussions",
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    },
  ];

  const discoverPosts = [
    {
      username: "travel.india",
      displayName: "Travel India",
      avatarUrl: "https://i.pravatar.cc/150?img=7",
      timestamp: "1h",
      caption: "Explore the incredible landscapes of Ladakh! 🏔️",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      likes: 5432,
      comments: 156,
    },
    {
      username: "food.lover",
      displayName: "Food Lover",
      avatarUrl: "https://i.pravatar.cc/150?img=8",
      timestamp: "3h",
      caption: "Best street food in Delhi! Must try 🍛",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=800&fit=crop",
      likes: 3241,
      comments: 89,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setShowStories(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowStories(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowStories(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl gradient-text">
            INSocial
          </h1>
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

      {/* Stories - Auto hide/show on scroll */}
      <div 
        className={`sticky top-14 z-30 glass border-b border-white/5 backdrop-blur-md transition-all duration-300 ${
          showStories ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        data-testid="stories-section"
      >
        <ScrollArea className="w-full">
          <div className="flex gap-3 p-4 max-w-2xl mx-auto">
            {stories.map((story) => (
              <StoryRing key={story.username} {...story} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Feed Toggle */}
      <div className={`sticky z-20 bg-background/80 backdrop-blur-md border-b transition-all duration-300 ${
        showStories ? "top-[120px]" : "top-14"
      }`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-2xl mx-auto">
          <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
            <TabsTrigger 
              value="my-feed" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-my-feed"
            >
              My Feed
            </TabsTrigger>
            <TabsTrigger 
              value="communities" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-communities"
            >
              <Globe className="w-4 h-4 mr-1" />
              Communities
            </TabsTrigger>
            <TabsTrigger 
              value="discover" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-discover"
            >
              Discover
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Feed Content */}
      <div className="pb-20">
        <Tabs value={activeTab} className="max-w-2xl mx-auto">
          <TabsContent value="my-feed" className="mt-0 p-4 space-y-4">
            {myFeedPosts.map((post, idx) => (
              <FeedPost key={idx} {...post} />
            ))}
          </TabsContent>

          <TabsContent value="communities" className="mt-0 p-4 space-y-4">
            {communities.map((community) => (
              <button
                key={community.id}
                className="w-full glass rounded-3xl overflow-hidden border border-white/10 hover-elevate active-elevate-2 text-left"
                data-testid={`community-${community.id}`}
              >
                <div className="relative h-32">
                  <img 
                    src={community.imageUrl} 
                    alt={community.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display font-bold text-white text-lg mb-1">{community.name}</h3>
                    <p className="text-white/80 text-sm">{community.description}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{community.members} members</span>
                    <span>•</span>
                    <span>{community.posts} posts</span>
                  </div>
                  <Button size="sm" variant="outline" data-testid={`join-community-${community.id}`}>
                    Join
                  </Button>
                </div>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="discover" className="mt-0 p-4 space-y-4">
            {discoverPosts.map((post, idx) => (
              <FeedPost key={idx} {...post} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavBar />
    </div>
  );
}

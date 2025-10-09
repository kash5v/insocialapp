import { useState, useEffect, useRef } from "react";
import { Search, Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import StoryRing from "@/components/StoryRing";
import StoryViewer, { StoryUser } from "@/components/StoryViewer";
import FeedPost from "@/components/FeedPost";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";

export default function Home() {
  const [activeTab, setActiveTab] = useState("my-feed");
  const [showStories, setShowStories] = useState(true);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryUser, setSelectedStoryUser] = useState(0);
  const lastScrollY = useRef(0);
  const [, setLocation] = useLocation();

  const storyUsers: StoryUser[] = [
    {
      username: "priya",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      stories: [
        { id: "1", imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=1200&fit=crop", timestamp: "2h ago" },
        { id: "2", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=1200&fit=crop", timestamp: "3h ago" },
      ],
    },
    {
      username: "raj",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      stories: [
        { id: "3", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop", timestamp: "5h ago" },
      ],
    },
    {
      username: "anjali",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      stories: [
        { id: "4", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1200&fit=crop", timestamp: "1d ago" },
      ],
    },
    {
      username: "arjun",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
      stories: [
        { id: "5", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=1200&fit=crop", timestamp: "8h ago" },
        { id: "6", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1200&fit=crop", timestamp: "10h ago" },
      ],
    },
    {
      username: "neha",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      stories: [
        { id: "7", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=1200&fit=crop", timestamp: "6h ago" },
      ],
    },
    {
      username: "vikram",
      avatarUrl: "https://i.pravatar.cc/150?img=6",
      stories: [
        { id: "8", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=1200&fit=crop", timestamp: "4h ago" },
      ],
    },
  ];

  const stories = [
    { username: "Your Story", isOwnStory: true, hasStory: false, isViewed: false },
    ...storyUsers.map(user => ({
      username: user.username,
      avatarUrl: user.avatarUrl,
      isViewed: user.username === "anjali",
      hasStory: true,
      isOwnStory: false,
    })),
  ];

  const myFeedPosts = [
    {
      username: "virat.kohli",
      displayName: "Virat Kohli",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
      timestamp: "3h",
      caption: "Great practice session today! Ready for the next match 🏏💪",
      imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=800&fit=crop",
      likes: 458000,
      comments: 12500,
      verificationType: "professional" as const,
      isPremium: false,
    },
    {
      username: "narendramodi",
      displayName: "Narendra Modi",
      avatarUrl: "https://i.pravatar.cc/150?img=33",
      timestamp: "1h",
      caption: "Proud to announce new initiatives for Digital India. Together we build a stronger nation! 🇮🇳",
      imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=800&fit=crop",
      likes: 892000,
      comments: 45000,
      verificationType: "government" as const,
      isPremium: false,
    },
    {
      username: "gautam.adani",
      displayName: "Gautam Adani",
      avatarUrl: "https://i.pravatar.cc/150?img=51",
      timestamp: "4h",
      caption: "Expanding our renewable energy portfolio. The future is green! 🌱⚡",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=800&fit=crop",
      likes: 125000,
      comments: 3400,
      verificationType: "professional" as const,
      isPremium: false,
    },
    {
      username: "kamlesh",
      displayName: "Kamlesh",
      avatarUrl: "https://i.pravatar.cc/150?img=68",
      timestamp: "6h",
      caption: "Just completed my first coding project! Excited to learn more 💻✨",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=800&fit=crop",
      likes: 245,
      comments: 18,
      verificationType: "individual" as const,
      isPremium: false,
    },
    {
      username: "annu",
      displayName: "Annu",
      avatarUrl: "https://i.pravatar.cc/150?img=5",
      timestamp: "8h",
      caption: "Beautiful morning at the park! Love supporting this amazing platform 🌸💖",
      imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=800&fit=crop",
      likes: 567,
      comments: 42,
      verificationType: "individual" as const,
      isPremium: true,
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
            InSocialApp
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
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {/* TODO: Add notification functionality */}}
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
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
            {stories.map((story, index) => (
              <StoryRing 
                key={story.username} 
                {...story}
                onClick={() => {
                  if (!story.isOwnStory && story.hasStory) {
                    setSelectedStoryUser(index - 1);
                    setShowStoryViewer(true);
                  }
                }}
              />
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

      {/* Story Viewer */}
      {showStoryViewer && (
        <StoryViewer
          users={storyUsers}
          initialUserIndex={selectedStoryUser}
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </div>
  );
}

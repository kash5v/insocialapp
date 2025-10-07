import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import StoryRing from "@/components/StoryRing";
import FeedPost from "@/components/FeedPost";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [activeTab, setActiveTab] = useState("my-feed");

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl gradient-text">
            INSocial
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Stories */}
      <div className="sticky top-14 z-30 glass border-b border-white/5 backdrop-blur-md">
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
      <div className="sticky top-[120px] z-20 bg-background/80 backdrop-blur-md border-b">
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

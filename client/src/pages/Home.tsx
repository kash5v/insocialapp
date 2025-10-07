import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppTopBar from "@/components/AppTopBar";
import SearchBar from "@/components/SearchBar";
import StoryRing from "@/components/StoryRing";
import FeedPost from "@/components/FeedPost";
import ThreadPost from "@/components/ThreadPost";
import CommunityCard from "@/components/CommunityCard";
import ConversationItem from "@/components/ConversationItem";
import ProfileHeader from "@/components/ProfileHeader";
import MusicTrackTile from "@/components/MusicTrackTile";
import MemoryGrid from "@/components/MemoryGrid";
import CameraInterface from "@/components/CameraInterface";
import BottomTabBar from "@/components/BottomTabBar";
import ThemeToggle from "@/components/ThemeToggle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Home() {
  //todo: remove mock functionality
  const stories = [
    { username: "Your Story", hasStory: false },
    { username: "priya", isViewed: false },
    { username: "raj", isViewed: false },
    { username: "anjali", isViewed: true },
    { username: "arjun", isViewed: false },
    { username: "neha", isViewed: false },
  ];

  const feedPosts = [
    {
      username: "priya.sharma",
      displayName: "Priya Sharma",
      timestamp: "2h",
      caption: "Beautiful sunset at Marine Drive 🌅 #Mumbai #India",
      imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=800&fit=crop",
      likes: 1234,
      comments: 45,
    },
    {
      username: "raj.tech",
      displayName: "Raj Patel",
      timestamp: "5h",
      caption: "Just launched our new startup! Excited for this journey 🚀",
      likes: 892,
      comments: 23,
    },
  ];

  const threads = [
    {
      username: "anjali.dev",
      displayName: "Anjali Verma",
      timestamp: "3h",
      content: "Working on an exciting new AI project. The possibilities are endless! 🤖 #AI #Tech",
      likes: 156,
      replies: 8,
      reposts: 12,
    },
  ];

  const communities = [
    {
      name: "Tech Enthusiasts India",
      handle: "tech_india",
      description: "Join the largest tech community in India. Share knowledge, discuss latest trends.",
      memberCount: 45230,
      isJoined: false,
    },
    {
      name: "Mumbai Foodies",
      handle: "mumbai_food",
      description: "Discover the best food spots in Mumbai! Share your culinary adventures.",
      memberCount: 12840,
      isJoined: true,
    },
  ];

  const conversations = [
    {
      name: "Priya Sharma",
      lastMessage: "See you at the cafe! ☕",
      timestamp: "2m",
      unreadCount: 3,
      isOnline: true,
    },
    {
      name: "Tech Enthusiasts",
      lastMessage: "Raj: Check out this new AI tool!",
      timestamp: "15m",
      unreadCount: 12,
      isOnline: false,
    },
  ];

  const musicTracks = [
    { title: "Kesariya", artist: "Arijit Singh", duration: "4:28" },
    { title: "Apna Bana Le", artist: "Arijit Singh", duration: "3:56" },
    { title: "Excuses", artist: "AP Dhillon", duration: "2:43" },
    { title: "Raataan Lambiyan", artist: "Jubin Nautiyal", duration: "3:23" },
  ];

  const memories = [
    { id: "1", date: "Jan 15", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop" },
    { id: "2", date: "Feb 3", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop" },
    { id: "3", date: "Mar 12", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" },
    { id: "4", date: "Mar 20", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop" },
    { id: "5", date: "Apr 8", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop" },
    { id: "6", date: "Apr 22", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="h-14 px-4 flex items-center justify-between">
          <h1 className="font-display font-bold text-xl bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            INSocial
          </h1>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="feed" className="w-full">
        <div className="sticky top-14 z-30 bg-background border-b border-border">
          <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
            <TabsTrigger value="feed" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Feed
            </TabsTrigger>
            <TabsTrigger value="threads" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Threads
            </TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Communities
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Messages
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Profile
            </TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Music
            </TabsTrigger>
            <TabsTrigger value="camera" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Camera
            </TabsTrigger>
            <TabsTrigger value="memories" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6">
              Memories
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="feed" className="mt-0">
          {/* Stories */}
          <div className="bg-card border-b border-card-border p-4">
            <ScrollArea className="w-full">
              <div className="flex gap-2">
                {stories.map((story) => (
                  <StoryRing key={story.username} {...story} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Feed Posts */}
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {feedPosts.map((post, idx) => (
              <FeedPost key={idx} {...post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threads" className="mt-0">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border-b border-card-border divide-y divide-border">
              {threads.map((thread, idx) => (
                <ThreadPost key={idx} {...thread} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="communities" className="mt-0">
          <div className="max-w-4xl mx-auto p-4">
            <div className="mb-4">
              <SearchBar />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communities.map((community) => (
                <CommunityCard key={community.handle} {...community} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-0">
          <div className="max-w-2xl mx-auto">
            <div className="p-4">
              <SearchBar />
            </div>
            <div className="px-2">
              {conversations.map((conv, idx) => (
                <ConversationItem key={idx} {...conv} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <div className="max-w-2xl mx-auto py-6">
            <ProfileHeader
              displayName="Priya Sharma"
              username="priya.sharma"
              bio="Digital Creator | Travel Enthusiast 🌏 | Mumbai 📍"
              isVerified={true}
              posts={342}
              followers={15420}
              following={892}
              isOwnProfile={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="music" className="mt-0">
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="font-display font-bold text-2xl mb-4">Trending Music</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {musicTracks.map((track) => (
                <MusicTrackTile key={track.title} {...track} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="camera" className="mt-0">
          <div className="max-w-md mx-auto p-4">
            <CameraInterface />
          </div>
        </TabsContent>

        <TabsContent value="memories" className="mt-0">
          <div className="max-w-2xl mx-auto p-4">
            <h2 className="font-display font-bold text-2xl mb-4">Your Memories</h2>
            <MemoryGrid memories={memories} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <BottomTabBar />
    </div>
  );
}

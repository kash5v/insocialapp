import { useState } from "react";
import { Search as SearchIcon, Hash, Users, Grid3x3, Music, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const channels = [
    { name: "Tech News India", handle: "tech_news", members: "125K", description: "Latest technology updates from India" },
    { name: "Bollywood Updates", handle: "bollywood", members: "2.5M", description: "All things Bollywood" },
    { name: "Cricket Mania", handle: "cricket", members: "5M", description: "Cricket news and updates" },
  ];

  const communities = [
    { name: "Mumbai Foodies", members: "45K", posts: "12.3K", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop" },
    { name: "Delhi Art Lovers", members: "32K", posts: "8.9K", imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=400&fit=crop" },
    { name: "Bangalore Startups", members: "67K", posts: "15.2K", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop" },
  ];

  const groups = [
    { name: "College Friends", members: 24, lastActive: "2h ago", isPrivate: true },
    { name: "Weekend Travelers", members: 156, lastActive: "5m ago", isPrivate: false },
    { name: "Book Club", members: 89, lastActive: "1d ago", isPrivate: false },
  ];

  const posts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop", likes: "2.3K", username: "priya.sharma" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop", likes: "1.8K", username: "raj.tech" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", likes: "3.5K", username: "travel.india" },
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop", likes: "4.2K", username: "food.lover" },
    { id: 5, imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop", likes: "1.2K", username: "anjali.mehta" },
    { id: 6, imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop", likes: "2.9K", username: "arjun.patel" },
  ];

  const hashtags = [
    { tag: "mumbai", posts: "1.2M" },
    { tag: "india", posts: "5.8M" },
    { tag: "travel", posts: "3.4M" },
    { tag: "food", posts: "2.1M" },
    { tag: "bollywood", posts: "4.5M" },
    { tag: "cricket", posts: "6.2M" },
  ];

  const accounts = [
    { username: "priya.sharma", name: "Priya Sharma", followers: "45K", avatarUrl: "https://i.pravatar.cc/150?img=1", verified: true },
    { username: "raj.tech", name: "Raj Patel", followers: "32K", avatarUrl: "https://i.pravatar.cc/150?img=2", verified: false },
    { username: "travel.india", name: "Travel India", followers: "128K", avatarUrl: "https://i.pravatar.cc/150?img=7", verified: true },
  ];

  const music = [
    { title: "Kesariya", artist: "Arijit Singh", plays: "45M", coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop" },
    { title: "Apna Bana Le", artist: "Arijit Singh", plays: "32M", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", plays: "89M", coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl gradient-text">Search</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-b p-4">
        <div className="max-w-2xl mx-auto relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users, posts, channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 glass border-white/10"
            data-testid="search-input"
          />
        </div>
      </div>

      <Tabs defaultValue="posts" className="max-w-2xl mx-auto">
        <div className="sticky top-[120px] z-20 bg-background/80 backdrop-blur-md border-b">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0 inline-flex">
              <TabsTrigger 
                value="posts" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-posts"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="accounts" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-accounts"
              >
                Accounts
              </TabsTrigger>
              <TabsTrigger 
                value="hashtags" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-hashtags"
              >
                Hashtags
              </TabsTrigger>
              <TabsTrigger 
                value="communities" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-communities"
              >
                Communities
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-groups"
              >
                Groups
              </TabsTrigger>
              <TabsTrigger 
                value="channels" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-channels"
              >
                Channels
              </TabsTrigger>
              <TabsTrigger 
                value="music" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold px-4"
                data-testid="tab-music"
              >
                Music
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <TabsContent value="posts" className="mt-0 p-2">
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <button 
                key={post.id}
                className="aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity relative group"
                data-testid={`post-${post.id}`}
              >
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                  <span className="text-white text-xs font-semibold">{post.likes} likes</span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="mt-0 p-4 space-y-3">
          {accounts.map((account) => (
            <div key={account.username} className="flex items-center justify-between" data-testid={`account-${account.username}`}>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={account.avatarUrl} />
                  <AvatarFallback className="bg-primary text-white">
                    {account.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-display font-bold text-foreground">{account.name}</h3>
                    {account.verified && (
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{account.username}</p>
                  <p className="text-xs text-muted-foreground">{account.followers} followers</p>
                </div>
              </div>
              <Button size="sm" variant="outline" data-testid={`follow-${account.username}`}>
                Follow
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="hashtags" className="mt-0 p-4 space-y-3">
          {hashtags.map((hashtag) => (
            <button
              key={hashtag.tag}
              className="w-full flex items-center justify-between p-3 rounded-xl hover-elevate active-elevate-2"
              data-testid={`hashtag-${hashtag.tag}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-bold text-foreground">#{hashtag.tag}</h3>
                  <p className="text-sm text-muted-foreground">{hashtag.posts} posts</p>
                </div>
              </div>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="communities" className="mt-0 p-4 space-y-3">
          {communities.map((community) => (
            <button
              key={community.name}
              className="w-full glass rounded-2xl overflow-hidden border border-white/10 hover-elevate active-elevate-2"
              data-testid={`community-${community.name}`}
            >
              <div className="relative h-32">
                <img src={community.imageUrl} alt={community.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <h3 className="font-display font-bold text-white text-lg">{community.name}</h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{community.members} members</span>
                  <span>•</span>
                  <span>{community.posts} posts</span>
                </div>
                <Button size="sm" variant="outline">Join</Button>
              </div>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="mt-0 p-4 space-y-3">
          {groups.map((group) => (
            <div
              key={group.name}
              className="glass rounded-2xl p-4 border border-white/10"
              data-testid={`group-${group.name}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.members} members</p>
                    <p className="text-xs text-muted-foreground mt-1">Last active {group.lastActive}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" data-testid={`join-group-${group.name}`}>
                  {group.isPrivate ? "Request" : "Join"}
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="channels" className="mt-0 p-4 space-y-3">
          {channels.map((channel) => (
            <div key={channel.handle} className="glass rounded-2xl p-4 border border-white/10" data-testid={`channel-${channel.handle}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">@{channel.handle}</p>
                    <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{channel.members} members</p>
                  </div>
                </div>
                <Button size="sm" variant="default" data-testid={`join-${channel.handle}`}>
                  Join
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="music" className="mt-0 p-4 space-y-3">
          {music.map((track) => (
            <button
              key={track.title}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover-elevate active-elevate-2"
              data-testid={`music-${track.title}`}
            >
              <img src={track.coverUrl} alt={track.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 text-left">
                <h3 className="font-display font-bold text-foreground">{track.title}</h3>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
                <p className="text-xs text-muted-foreground mt-1">{track.plays} plays</p>
              </div>
              <Music className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </TabsContent>
      </Tabs>

      <BottomNavBar />
    </div>
  );
}

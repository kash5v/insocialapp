import { useState } from "react";
import { Search, Plus, Camera, MessageSquare, Users, Hash, StickyNote, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const chats = [
    {
      id: 1,
      name: "Priya Sharma",
      username: "priya.sharma",
      lastMessage: "See you at the cafe! ☕",
      timestamp: "2m",
      unreadCount: 3,
      isOnline: true,
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Raj Patel",
      username: "raj.tech",
      lastMessage: "Check out this new AI tool!",
      timestamp: "15m",
      unreadCount: 0,
      isOnline: false,
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
  ];

  const groups = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      lastMessage: "Anjali: This is amazing! 🚀",
      timestamp: "1h",
      unreadCount: 12,
      members: 234,
    },
    {
      id: 2,
      name: "College Friends",
      lastMessage: "Vikram: Weekend plans?",
      timestamp: "3h",
      unreadCount: 0,
      members: 15,
    },
  ];

  const channels = [
    { id: 1, name: "Tech News India", handle: "tech_news", members: "125K" },
    { id: 2, name: "Bollywood Updates", handle: "bollywood", members: "2.5M" },
  ];

  const notes = [
    { id: 1, title: "Shopping List", preview: "Groceries, vegetables...", date: "Today" },
    { id: 2, title: "Meeting Notes", preview: "Discuss project timeline...", date: "Yesterday" },
  ];

  const communities = [
    { id: 1, name: "Mumbai Foodies", members: "12.8K", posts: 234 },
    { id: 2, name: "Travel India", members: "45.2K", posts: 890 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Action Buttons */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl gradient-text">Messages</h1>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full"
              data-testid="action-camera"
            >
              <Camera className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full"
              data-testid="action-new-chat"
            >
              <Plus className="w-5 h-5" />
            </Button>
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

      {/* Search */}
      <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-b p-4">
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 glass border-white/10"
            data-testid="search-messages"
          />
        </div>
      </div>

      <Tabs defaultValue="chats" className="max-w-2xl mx-auto">
        <div className="sticky top-[120px] z-20 bg-background/80 backdrop-blur-md border-b">
          <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0 px-2 overflow-x-auto hide-scrollbar">
            <TabsTrigger 
              value="chats" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold whitespace-nowrap"
              data-testid="tab-chats"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chats
            </TabsTrigger>
            <TabsTrigger 
              value="groups" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold whitespace-nowrap"
              data-testid="tab-groups"
            >
              <Users className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
            <TabsTrigger 
              value="channels" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold whitespace-nowrap"
              data-testid="tab-channels"
            >
              <Hash className="w-4 h-4 mr-2" />
              Channels
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold whitespace-nowrap"
              data-testid="tab-notes"
            >
              <StickyNote className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger 
              value="communities" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold whitespace-nowrap"
              data-testid="tab-communities"
            >
              <Globe className="w-4 h-4 mr-2" />
              Communities
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chats" className="mt-0">
          <div className="divide-y divide-border/50">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2 transition-colors"
                data-testid={`chat-${chat.id}`}
              >
                <div className="relative">
                  <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                    <AvatarImage src={chat.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
                      {chat.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-semibold text-foreground">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{chat.unreadCount}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="mt-0">
          <div className="divide-y divide-border/50">
            {groups.map((group) => (
              <button
                key={group.id}
                className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2"
                data-testid={`group-${group.id}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-semibold text-foreground">{group.name}</h3>
                    <span className="text-xs text-muted-foreground">{group.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{group.members} members</p>
                </div>
                {group.unreadCount > 0 && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{group.unreadCount}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="mt-0 p-4 space-y-3">
          {channels.map((channel) => (
            <div key={channel.id} className="glass rounded-2xl p-4 border border-white/10" data-testid={`channel-${channel.id}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Hash className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">@{channel.handle} · {channel.members} members</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="notes" className="mt-0 p-4 space-y-3">
          {notes.map((note) => (
            <button
              key={note.id}
              className="w-full glass rounded-2xl p-4 border border-white/10 text-left hover-elevate active-elevate-2"
              data-testid={`note-${note.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-foreground">{note.title}</h3>
                <span className="text-xs text-muted-foreground">{note.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{note.preview}</p>
            </button>
          ))}
        </TabsContent>

        <TabsContent value="communities" className="mt-0 p-4 space-y-3">
          {communities.map((community) => (
            <div key={community.id} className="glass rounded-2xl p-4 border border-white/10" data-testid={`community-${community.id}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground">{community.name}</h3>
                  <p className="text-sm text-muted-foreground">{community.members} members · {community.posts} posts</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <BottomNavBar />
    </div>
  );
}

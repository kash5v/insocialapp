import { useState } from "react";
import { Search as SearchIcon, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const explorePosts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" },
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop" },
    { id: 5, imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop" },
    { id: 6, imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop" },
    { id: 7, imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop" },
    { id: 8, imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" },
    { id: 9, imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop" },
  ];

  const channels = [
    { name: "Tech News India", handle: "tech_news", members: "125K", description: "Latest technology updates from India" },
    { name: "Bollywood Updates", handle: "bollywood", members: "2.5M", description: "All things Bollywood" },
    { name: "Cricket Mania", handle: "cricket", members: "5M", description: "Cricket news and updates" },
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

      <Tabs defaultValue="explore" className="max-w-2xl mx-auto">
        <div className="sticky top-[120px] z-20 bg-background/80 backdrop-blur-md border-b">
          <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
            <TabsTrigger 
              value="explore" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-explore"
            >
              Explore
            </TabsTrigger>
            <TabsTrigger 
              value="channels" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-channels"
            >
              Channels
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="explore" className="mt-0 p-2">
          <div className="grid grid-cols-3 gap-1">
            {explorePosts.map((post) => (
              <button 
                key={post.id}
                className="aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
                data-testid={`explore-post-${post.id}`}
              >
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="mt-0 p-4 space-y-3">
          {channels.map((channel) => (
            <div key={channel.handle} className="glass rounded-2xl p-4 border border-white/10" data-testid={`channel-${channel.handle}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground">@{channel.handle}</p>
                    <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{channel.members} members</p>
                  </div>
                </div>
                <button 
                  className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  data-testid={`join-${channel.handle}`}
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <BottomNavBar />
    </div>
  );
}

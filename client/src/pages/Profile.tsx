import { Settings, Archive, Bookmark, UserPlus, Users, Grid, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Profile() {
  const userPosts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop", likes: 1234 },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop", likes: 892 },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", likes: 2156 },
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop", likes: 3421 },
    { id: 5, imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop", likes: 987 },
    { id: 6, imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop", likes: 1567 },
  ];

  const savedPosts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-xl gradient-text">priya.sharma</h1>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full" data-testid="button-settings">
              <Settings className="w-5 h-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display text-2xl">
                PS
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl text-foreground mb-1">Priya Sharma</h2>
              <p className="text-muted-foreground mb-3">Digital Creator | Travel Enthusiast 🌏 | Mumbai 📍</p>
              
              {/* Stats */}
              <div className="flex gap-6 mb-4">
                <button className="text-center" data-testid="stat-posts">
                  <div className="font-display font-bold text-xl text-foreground">342</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </button>
                <button className="text-center" data-testid="stat-followers">
                  <div className="font-display font-bold text-xl text-foreground">15.4K</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </button>
                <button className="text-center" data-testid="stat-following">
                  <div className="font-display font-bold text-xl text-foreground">892</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 font-semibold" 
                  data-testid="button-follow"
                >
                  <Users className="w-4 h-4" />
                  Follow
                </Button>
                <Button 
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent text-white border-0 font-semibold hover:opacity-90"
                  data-testid="button-add-plus"
                >
                  <UserPlus className="w-4 h-4" />
                  Add+
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-y">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
              <TabsTrigger 
                value="posts" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                data-testid="tab-posts"
              >
                <Grid className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger 
                value="archive" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                data-testid="tab-archive"
              >
                <Archive className="w-5 h-5" />
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                data-testid="tab-saved"
              >
                <Bookmark className="w-5 h-5" />
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map((post) => (
                <button
                  key={post.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`post-${post.id}`}
                >
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <Heart className="w-5 h-5 fill-white" />
                      <span className="font-semibold">{post.likes.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archive" className="mt-0 p-6">
            <div className="text-center py-12">
              <Archive className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">Your Archive</h3>
              <p className="text-muted-foreground">Stories and posts you've archived will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <button
                  key={post.id}
                  className="aspect-square overflow-hidden"
                  data-testid={`saved-${post.id}`}
                >
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavBar />
    </div>
  );
}

import { Settings, Archive, Bookmark, UserPlus, Users, Grid, Heart, Search, MapPin, Lock, Video, Share2, Crown, Camera, Tag, List, Film, Play, Copy, Check, LogOut, Edit, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import EditProfileDialog from "@/components/EditProfileDialog";
import FollowersDialog from "@/components/FollowersDialog";
import FollowingDialog from "@/components/FollowingDialog";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: string;
  numericId: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImageUrl: string | null;
  bio: string | null;
  location: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [copiedId, setCopiedId] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery<UserProfile>({
    queryKey: ['/api/users', user?.id],
    enabled: !!user?.id,
  });

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      toast({
        title: "User ID Copied!",
        description: "Your unique user ID has been copied to clipboard.",
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.firstName || user.email?.split('@')[0] || 'User';
  
  const username = user.username || user.email?.split('@')[0] || 'user';
  const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || user.email?.[0] || 'U');
  
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

  const memories = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop" },
  ];

  const photos = userPosts;
  const timeline = [
    { id: 1, type: "text", content: "Just had the best chai at my favorite cafe! ☕", timestamp: "2h ago", likes: 234 },
    { id: 2, type: "photo", imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop", caption: "Sunset vibes 🌅", timestamp: "5h ago", likes: 1234 },
    { id: 3, type: "text", content: "Weekend plans: exploring new places and trying new food!", timestamp: "1d ago", likes: 456 },
  ];
  const shorts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", views: "12.5K", duration: "0:15" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", views: "8.3K", duration: "0:30" },
  ];
  const longVideos = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop", duration: "5:23" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop", duration: "3:45" },
  ];
  const membersOnly = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop" },
  ];
  const reposts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop" },
  ];
  const tags = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-xl gradient-text">@{username}</h1>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/settings")}
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl text-foreground mb-1">{displayName}</h2>
              
              {/* Bio */}
              {user.bio && (
                <p className="text-sm text-foreground mb-2" data-testid="profile-bio">
                  {user.bio}
                </p>
              )}
              
              {/* Location */}
              {user.location && (
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground" data-testid="profile-location">
                    {user.location}
                  </span>
                </div>
              )}
              
              {/* Stats */}
              <div className="flex gap-4 mb-4">
                <button className="text-center" data-testid="stat-posts">
                  <div className="font-display font-bold text-lg text-foreground">0</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </button>
                <button 
                  className="text-center" 
                  data-testid="stat-followers"
                  onClick={() => setFollowersDialogOpen(true)}
                >
                  <div className="font-display font-bold text-lg text-foreground">
                    {userProfile?.followerCount?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </button>
                <button 
                  className="text-center" 
                  data-testid="stat-following"
                  onClick={() => setFollowingDialogOpen(true)}
                >
                  <div className="font-display font-bold text-lg text-foreground">
                    {userProfile?.followingCount?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 font-semibold" 
                  onClick={() => setEditDialogOpen(true)}
                  data-testid="button-edit-profile"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 gap-2 font-semibold"
                  onClick={() => setLocation('/archive')}
                  data-testid="button-share-profile"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Access Tiles */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Memories Private Album */}
              <button
                className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover-elevate active-elevate-2 border border-white/10"
                data-testid="tile-memories"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">Memories</span>
              </button>

              {/* Archived */}
              <button
                className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover-elevate active-elevate-2 border border-white/10"
                data-testid="tile-archived"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Archive className="w-6 h-6 text-accent" />
                </div>
                <span className="text-xs font-medium text-center">Archived</span>
              </button>

              {/* Saved */}
              <button
                className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover-elevate active-elevate-2 border border-white/10"
                data-testid="tile-saved"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-center">Saved</span>
              </button>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="px-6 pb-4">
            <h3 className="font-display font-semibold text-foreground mb-3">Highlights</h3>
            <ScrollArea className="w-full">
              <div className="flex gap-4">
                {["Travel", "Food", "Fashion", "Tech", "Fitness"].map((highlight) => (
                  <button
                    key={highlight}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                    data-testid={`highlight-${highlight.toLowerCase()}`}
                  >
                    <div className="w-16 h-16 rounded-full ring-2 ring-primary/30 p-0.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-xl">{highlight[0]}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{highlight}</span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="photos" className="w-full">
          <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-y">
            <ScrollArea className="w-full">
              <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0 inline-flex">
                <TabsTrigger 
                  value="photos" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-photos"
                >
                  <Grid className="w-4 h-4" />
                  Photo Grid
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-timeline"
                >
                  <List className="w-4 h-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger 
                  value="shorts" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-shorts"
                >
                  <Play className="w-4 h-4" />
                  Shorts
                </TabsTrigger>
                <TabsTrigger 
                  value="longvideos" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-longvideos"
                >
                  <Film className="w-4 h-4" />
                  Long Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="members" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-members"
                >
                  <Crown className="w-4 h-4" />
                  Members Only Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="reposts" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-reposts"
                >
                  <Share2 className="w-4 h-4" />
                  Reposts
                </TabsTrigger>
                <TabsTrigger 
                  value="tags" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-tags"
                >
                  <Tag className="w-4 h-4" />
                  Tags
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <TabsContent value="photos" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {photos.map((post) => (
                <button
                  key={post.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`photo-${post.id}`}
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

          <TabsContent value="timeline" className="mt-0 p-4 space-y-4">
            {timeline.map((item) => (
              <div
                key={item.id}
                className="glass rounded-2xl p-4 border border-white/10"
                data-testid={`timeline-${item.id}`}
              >
                {item.type === "text" ? (
                  <div>
                    <p className="text-foreground mb-2">{item.content}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img src={item.imageUrl} alt="" className="w-full rounded-xl mb-2" />
                    <p className="text-foreground mb-2">{item.caption}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="shorts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {shorts.map((short) => (
                <button
                  key={short.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`short-${short.id}`}
                >
                  <img src={short.imageUrl} alt="" className="w-full h-full object-cover" />
                  <Play className="absolute top-2 right-2 w-5 h-5 text-white" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                    {short.duration}
                  </div>
                  <div className="absolute bottom-2 right-2 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                    {short.views}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="longvideos" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {longVideos.map((video) => (
                <button
                  key={video.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`longvideo-${video.id}`}
                >
                  <img src={video.imageUrl} alt="" className="w-full h-full object-cover" />
                  <Film className="absolute top-2 right-2 w-5 h-5 text-white" />
                  <div className="absolute bottom-2 right-2 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {membersOnly.map((post) => (
                <button
                  key={post.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`members-${post.id}`}
                >
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  <Crown className="absolute top-2 right-2 w-5 h-5 text-primary" />
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reposts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {reposts.map((repost) => (
                <button
                  key={repost.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`repost-${repost.id}`}
                >
                  <img src={repost.imageUrl} alt="" className="w-full h-full object-cover" />
                  <Share2 className="absolute top-2 right-2 w-5 h-5 text-white" />
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className="relative aspect-square overflow-hidden group"
                  data-testid={`tag-${tag.id}`}
                >
                  <img src={tag.imageUrl} alt="" className="w-full h-full object-cover" />
                  <Tag className="absolute top-2 right-2 w-5 h-5 text-white" />
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavBar />
      
      {user && (
        <>
          <EditProfileDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            user={user}
          />
          <FollowersDialog
            open={followersDialogOpen}
            onOpenChange={setFollowersDialogOpen}
            userId={user.id}
          />
          <FollowingDialog
            open={followingDialogOpen}
            onOpenChange={setFollowingDialogOpen}
            userId={user.id}
          />
        </>
      )}
    </div>
  );
}

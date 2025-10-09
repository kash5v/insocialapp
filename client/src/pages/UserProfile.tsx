import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BottomNavBar from "@/components/BottomNavBar";
import FollowersDialog from "@/components/FollowersDialog";
import FollowingDialog from "@/components/FollowingDialog";
import { ArrowLeft, Grid, List, Play, Film, Crown, Share2, Tag, Heart, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

interface UserProfileData {
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

export default function UserProfile() {
  const { userId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  const { data: profileData, isLoading } = useQuery<UserProfileData>({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      return await apiRequest(`/api/users/${userId}/follow`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Success",
        description: "You are now following this user",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      return await apiRequest(`/api/users/${userId}/follow`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Success",
        description: "You unfollowed this user",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
    },
  });

  const handleFollowToggle = () => {
    if (!profileData) return;
    
    if (profileData.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Button onClick={() => setLocation('/search')} data-testid="button-back-search">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  if (profileData.isOwnProfile) {
    setLocation('/profile');
    return null;
  }

  const displayName = profileData.firstName && profileData.lastName 
    ? `${profileData.firstName} ${profileData.lastName}` 
    : profileData.firstName || profileData.email?.split('@')[0] || 'User';
  
  const username = profileData.username || profileData.email?.split('@')[0] || 'user';
  const initials = (profileData.firstName?.[0] || '') + (profileData.lastName?.[0] || profileData.email?.[0] || 'U');

  const userPosts = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=400&fit=crop", likes: 1234 },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop", likes: 892 },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop", likes: 2156 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setLocation('/search')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display font-bold text-xl gradient-text">@{username}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20">
              <AvatarImage src={profileData.profileImageUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-display font-bold text-2xl text-foreground mb-1">{displayName}</h2>
              <p className="text-sm text-muted-foreground mb-3">@{username}</p>
              
              {profileData.bio && (
                <p className="text-sm text-foreground mb-2" data-testid="profile-bio">
                  {profileData.bio}
                </p>
              )}
              
              {profileData.location && (
                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground" data-testid="profile-location">
                    {profileData.location}
                  </span>
                </div>
              )}
              
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
                    {profileData.followerCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </button>
                <button 
                  className="text-center" 
                  data-testid="stat-following"
                  onClick={() => setFollowingDialogOpen(true)}
                >
                  <div className="font-display font-bold text-lg text-foreground">
                    {profileData.followingCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </button>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant={profileData.isFollowing ? "outline" : "default"}
                  className="flex-1 font-semibold"
                  onClick={handleFollowToggle}
                  disabled={followMutation.isPending || unfollowMutation.isPending}
                  data-testid="button-follow"
                >
                  {followMutation.isPending || unfollowMutation.isPending 
                    ? "Loading..." 
                    : profileData.isFollowing ? "Following" : "Follow"}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 gap-2 font-semibold" 
                  data-testid="button-message"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-y">
            <ScrollArea className="w-full">
              <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0 inline-flex">
                <TabsTrigger 
                  value="posts" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 gap-2"
                  data-testid="tab-posts"
                >
                  <Grid className="w-4 h-4" />
                  Posts
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
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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

          <TabsContent value="timeline" className="mt-0 p-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No timeline posts yet</p>
            </div>
          </TabsContent>

          <TabsContent value="shorts" className="mt-0">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No shorts yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavBar />
      
      {userId && (
        <>
          <FollowersDialog
            open={followersDialogOpen}
            onOpenChange={setFollowersDialogOpen}
            userId={userId}
          />
          <FollowingDialog
            open={followingDialogOpen}
            onOpenChange={setFollowingDialogOpen}
            userId={userId}
          />
        </>
      )}
    </div>
  );
}

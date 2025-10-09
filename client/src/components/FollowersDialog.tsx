import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@shared/schema";

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function FollowersDialog({ open, onOpenChange, userId }: FollowersDialogProps) {
  const [, setLocation] = useLocation();
  
  const { data: followers, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users', userId, 'followers'],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/followers`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch followers');
      return response.json();
    },
    enabled: open && !!userId,
  });

  const handleUserClick = (user: User) => {
    setLocation(`/user/${user.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : followers && followers.length > 0 ? (
            <div className="space-y-2">
              {followers.map((follower) => {
                const displayName = follower.firstName && follower.lastName 
                  ? `${follower.firstName} ${follower.lastName}` 
                  : follower.firstName || follower.email?.split('@')[0] || 'User';
                const username = follower.username || follower.email?.split('@')[0] || 'user';
                const initials = (follower.firstName?.[0] || '') + (follower.lastName?.[0] || follower.email?.[0] || 'U');

                return (
                  <button
                    key={follower.id}
                    onClick={() => handleUserClick(follower)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2"
                    data-testid={`follower-${follower.id}`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={follower.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">{displayName}</p>
                      <p className="text-sm text-muted-foreground">@{username}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No followers yet</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

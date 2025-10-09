import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@shared/schema";

interface FollowingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export default function FollowingDialog({ open, onOpenChange, userId }: FollowingDialogProps) {
  const [, setLocation] = useLocation();
  
  const { data: following, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users', userId, 'following'],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/following`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch following');
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
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : following && following.length > 0 ? (
            <div className="space-y-2">
              {following.map((user) => {
                const displayName = user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.firstName || user.email?.split('@')[0] || 'User';
                const username = user.username || user.email?.split('@')[0] || 'user';
                const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || user.email?.[0] || 'U');

                return (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover-elevate active-elevate-2"
                    data-testid={`following-${user.id}`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.profileImageUrl || undefined} />
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
              <p className="text-muted-foreground">Not following anyone yet</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

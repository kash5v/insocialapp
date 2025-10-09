import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MatrixSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function MatrixSetup({ open, onOpenChange, onSuccess }: MatrixSetupProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tempUserId = `user_${Date.now()}`;
      
      const response = await apiRequest('POST', '/api/matrix/login', {
        userId: tempUserId,
        username,
        password,
        homeserverUrl: "https://matrix.org",
      });

      const data = await response.json();

      localStorage.setItem('matrix_user_id', tempUserId);
      localStorage.setItem('matrix_username', username);
      
      toast({
        title: "Connected to Matrix!",
        description: `Logged in as ${data.matrixUserId}`,
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to Matrix",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to Matrix</DialogTitle>
          <DialogDescription>
            Enter your Matrix credentials to access messaging features.
            Don't have an account? Register at matrix.org
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="@username:matrix.org"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-testid="input-matrix-username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-matrix-password"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-matrix"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogin} 
            disabled={loading}
            data-testid="button-connect-matrix"
          >
            {loading ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

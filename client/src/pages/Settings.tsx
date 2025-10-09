import { ArrowLeft, LogOut, Bell, Lock, Eye, HelpCircle, Shield, Moon, Sun, Monitor, ChevronRight, User, Mail, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import BottomNavBar from "@/components/BottomNavBar";
import { useTheme } from "@/hooks/useTheme";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(user?.privateAccount ?? false);

  useEffect(() => {
    if (user?.privateAccount !== undefined && user?.privateAccount !== null) {
      setPrivateAccount(user.privateAccount);
    }
  }, [user?.privateAccount]);

  const updatePrivacyMutation = useMutation({
    mutationFn: async (isPrivate: boolean) => {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ privateAccount: isPrivate }),
      });
      if (!response.ok) throw new Error("Failed to update privacy");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Privacy updated",
        description: `Your account is now ${privateAccount ? 'private' : 'public'}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update privacy settings",
        variant: "destructive",
      });
      setPrivateAccount(!privateAccount);
    },
  });

  const handlePrivacyToggle = () => {
    const newValue = !privateAccount;
    setPrivateAccount(newValue);
    updatePrivacyMutation.mutate(newValue);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const settingsSections = [
    {
      title: "Personal Information",
      items: [
        {
          icon: Mail,
          label: "Email",
          description: user?.email || "Not set",
          action: () => {},
          hasSwitch: false,
          type: "info" as const,
        },
        {
          icon: User,
          label: "User ID",
          description: user?.id?.toString() || "N/A",
          action: () => {},
          hasSwitch: false,
          type: "info" as const,
        },
        {
          icon: Hash,
          label: "User UUID",
          description: user?.id || "N/A",
          action: () => {},
          hasSwitch: false,
          type: "info" as const,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: Lock,
          label: "Privacy",
          description: "Manage your privacy settings",
          action: () => {},
          hasSwitch: false,
          type: "action" as const,
        },
        {
          icon: Shield,
          label: "Security",
          description: "Password and authentication",
          action: () => {},
          hasSwitch: false,
          type: "action" as const,
        },
        {
          icon: Eye,
          label: "Private Account",
          description: "Only approved followers can see your posts",
          action: handlePrivacyToggle,
          hasSwitch: true,
          switchValue: privateAccount,
          type: "action" as const,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Get notified about new activity",
          action: () => setNotificationsEnabled(!notificationsEnabled),
          hasSwitch: true,
          switchValue: notificationsEnabled,
          type: "action" as const,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "Get help and support",
          action: () => {},
          hasSwitch: false,
          type: "action" as const,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/profile")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-display font-bold text-xl">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Account Info */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display text-2xl">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.firstName || 'User'}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Appearance Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground px-2">
            Appearance
          </h2>
          <Card className="p-4">
            <div className="space-y-3">
              <p className="font-medium text-foreground">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                    className={`p-3 rounded-md border-2 flex flex-col items-center gap-2 hover-elevate active-elevate-2 ${
                      theme === option.value 
                        ? "border-primary bg-primary/10" 
                        : "border-border"
                    }`}
                    data-testid={`theme-${option.value}`}
                  >
                    <option.icon className={`w-5 h-5 ${theme === option.value ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${theme === option.value ? "text-primary" : "text-muted-foreground"}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground px-2">
              {section.title}
            </h2>
            <Card className="divide-y">
              {section.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className={`w-full p-4 flex items-center gap-4 ${item.type === 'action' ? 'hover-elevate active-elevate-2 cursor-pointer' : ''}`}
                  onClick={item.type === 'action' ? item.action : undefined}
                  data-testid={`setting-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                  {item.hasSwitch && 'switchValue' in item ? (
                    <Switch
                      checked={item.switchValue}
                      onCheckedChange={(checked) => item.action()}
                      onClick={(e) => e.stopPropagation()}
                      data-testid={`switch-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                  ) : item.type === 'action' ? (
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : null}
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card className="p-4">
          <button
            onClick={() => setLogoutDialogOpen(true)}
            className="w-full flex items-center gap-4 hover-elevate active-elevate-2 text-left"
            data-testid="button-logout"
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-destructive">Log Out</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
          </button>
        </Card>

        {/* App Info */}
        <div className="text-center py-8 space-y-2">
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ by your team
          </p>
        </div>
      </div>

      <BottomNavBar />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to log back in to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-logout">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-logout"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

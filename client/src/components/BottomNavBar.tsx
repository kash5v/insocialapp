import { Home, Search, Video, PlusCircle, MessageCircle, User } from "lucide-react";
import { useLocation } from "wouter";

export default function BottomNavBar() {
  const [location, setLocation] = useLocation();

  const tabs = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "watch", icon: Video, label: "Watch", path: "/watch" },
    { id: "create", icon: PlusCircle, label: "Create", path: "/create" },
    { id: "messages", icon: MessageCircle, label: "Messages", path: "/messages" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="glass-strong border-t border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 px-2 max-w-2xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            
            return (
              <button
                key={tab.id}
                onClick={() => setLocation(tab.path)}
                data-testid={`nav-${tab.id}`}
                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl
                  transition-all duration-200 min-w-[60px]
                  ${active ? 'scale-110' : 'scale-100 opacity-70'}
                `}
              >
                <div className={`
                  relative p-1.5 rounded-xl transition-all duration-200
                  ${active ? 'bg-gradient-to-r from-primary to-accent' : ''}
                `}>
                  <Icon 
                    className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-foreground'}`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </div>
                <span className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { useState } from "react";

export default function BottomTabBar() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "create", icon: PlusCircle, label: "Create" },
    { id: "messages", icon: MessageCircle, label: "Messages" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-card-border z-50">
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                console.log(`${tab.label} tab clicked`);
              }}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full hover-elevate active-elevate-2"
              data-testid={`tab-${tab.id}`}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-primary fill-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

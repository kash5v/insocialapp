import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppTopBarProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export default function AppTopBar({ title, showBack = false, actions }: AppTopBarProps) {
  return (
    <div className="h-14 bg-card border-b border-card-border px-4 flex items-center justify-between sticky top-0 z-40" data-testid="app-top-bar">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => console.log("Back clicked")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="font-display font-bold text-lg text-foreground" data-testid="topbar-title">
          {title}
        </h1>
      </div>
      {actions || (
        <Button size="icon" variant="ghost" data-testid="button-menu">
          <MoreVertical className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}

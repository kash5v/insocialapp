import { Camera, Image as ImageIcon, Music, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";

export default function Create() {
  const memories = [
    { id: "1", date: "Jan 15", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop" },
    { id: "2", date: "Feb 3", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop" },
    { id: "3", date: "Mar 12", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" },
    { id: "4", date: "Mar 20", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop" },
    { id: "5", date: "Apr 8", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop" },
    { id: "6", date: "Apr 22", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" },
  ];

  const createOptions = [
    { icon: Camera, label: "Camera", gradient: "from-purple-500 to-pink-500", testId: "create-camera" },
    { icon: ImageIcon, label: "Photo", gradient: "from-blue-500 to-cyan-500", testId: "create-photo" },
    { icon: Video, label: "Video", gradient: "from-red-500 to-orange-500", testId: "create-video" },
    { icon: Music, label: "Music", gradient: "from-green-500 to-teal-500", testId: "create-music" },
    { icon: FileText, label: "Post", gradient: "from-indigo-500 to-purple-500", testId: "create-post" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl gradient-text">Create</h1>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Create Options */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h2 className="font-display font-bold text-xl text-foreground mb-4">What do you want to create?</h2>
          <div className="grid grid-cols-2 gap-3">
            {createOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.label}
                  variant="outline"
                  className={`h-auto py-6 flex flex-col gap-2 bg-gradient-to-br ${option.gradient} border-0 text-white hover:opacity-90 transition-opacity`}
                  data-testid={option.testId}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-display font-semibold">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Memories */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-foreground">Memories</h2>
            <Button variant="ghost" size="sm" className="text-primary font-semibold" data-testid="view-all-memories">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {memories.map((memory) => (
              <button
                key={memory.id}
                className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/10 hover:scale-105 transition-transform"
                data-testid={`memory-${memory.id}`}
              >
                <img src={memory.imageUrl} alt={`Memory ${memory.date}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-white text-xs font-semibold">{memory.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <h3 className="font-display font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3" data-testid="action-story">
              <Camera className="w-5 h-5" />
              Add to Story
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" data-testid="action-reel">
              <Video className="w-5 h-5" />
              Create Reel
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" data-testid="action-live">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              Go Live
            </Button>
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}

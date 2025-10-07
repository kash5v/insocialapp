import { Button } from "@/components/ui/button";
import { Camera, FlipHorizontal, Zap, Timer, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function CameraInterface() {
  const [flashMode, setFlashMode] = useState<"auto" | "on" | "off">("auto");

  return (
    <div className="relative w-full h-[600px] bg-black rounded-xl overflow-hidden" data-testid="camera-interface">
      {/* Camera Viewfinder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-destructive/20 flex items-center justify-center">
        <Camera className="w-24 h-24 text-white/30" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              const modes: Array<"auto" | "on" | "off"> = ["auto", "on", "off"];
              const current = modes.indexOf(flashMode);
              setFlashMode(modes[(current + 1) % modes.length]);
            }}
            className="p-2 hover-elevate active-elevate-2 rounded-full"
            data-testid="button-flash"
          >
            <Zap className={`w-6 h-6 ${flashMode === "on" ? "text-yellow-400" : "text-white"}`} />
          </button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            data-testid="button-flip"
          >
            <FlipHorizontal className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            data-testid="button-timer"
          >
            <Timer className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-around">
          {/* Gallery */}
          <button
            className="w-12 h-12 rounded-lg border-2 border-white/50 overflow-hidden hover-elevate active-elevate-2"
            data-testid="button-gallery"
          >
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-destructive/40 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Capture */}
          <button
            className="relative w-18 h-18 hover-elevate active-elevate-2 rounded-full"
            onClick={() => console.log("Photo captured!")}
            data-testid="button-capture"
          >
            <div className="w-18 h-18 rounded-full border-4 border-white p-1">
              <div className="w-full h-full rounded-full bg-white" />
            </div>
          </button>

          {/* Filters */}
          <button
            className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm hover-elevate active-elevate-2"
            data-testid="button-filters"
          >
            <span className="text-white font-medium text-sm">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}

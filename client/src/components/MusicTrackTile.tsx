import { Play } from "lucide-react";

interface MusicTrackTileProps {
  title: string;
  artist: string;
  coverArt?: string;
  duration: string;
}

export default function MusicTrackTile({ title, artist, coverArt, duration }: MusicTrackTileProps) {
  return (
    <button
      className="group relative aspect-square rounded-lg overflow-hidden hover-elevate active-elevate-2"
      onClick={() => console.log(`Playing: ${title} by ${artist}`)}
      data-testid="music-track"
    >
      {/* Cover Art */}
      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10">
        {coverArt && (
          <img src={coverArt} alt={title} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-primary rounded-full p-3">
          <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
        </div>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-sm font-semibold text-white truncate" data-testid="track-title">
          {title}
        </p>
        <p className="text-xs text-white/80 truncate" data-testid="track-artist">
          {artist}
        </p>
      </div>

      {/* Duration */}
      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded-md">
        <span className="text-xs text-white font-mono">{duration}</span>
      </div>
    </button>
  );
}

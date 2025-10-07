interface MemoryGridProps {
  memories: Array<{
    id: string;
    imageUrl?: string;
    date: string;
  }>;
}

export default function MemoryGrid({ memories }: MemoryGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1" data-testid="memory-grid">
      {memories.map((memory) => (
        <button
          key={memory.id}
          className="relative aspect-square overflow-hidden hover-elevate active-elevate-2 rounded-sm"
          onClick={() => console.log(`Memory clicked: ${memory.id}`)}
          data-testid={`memory-${memory.id}`}
        >
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5">
            {memory.imageUrl && (
              <img
                src={memory.imageUrl}
                alt={memory.date}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-xs text-white font-medium">{memory.date}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

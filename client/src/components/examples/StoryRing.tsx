import StoryRing from '../StoryRing';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function StoryRingExample() {
  const stories = [
    { username: "Your Story", hasStory: false },
    { username: "priya", isViewed: false },
    { username: "raj", isViewed: false },
    { username: "anjali", isViewed: true },
    { username: "arjun", isViewed: false },
    { username: "neha", isViewed: false },
    { username: "rohan", isViewed: true },
    { username: "kavya", isViewed: false },
  ];

  return (
    <div className="bg-card border-b border-card-border p-4">
      <ScrollArea className="w-full">
        <div className="flex gap-2">
          {stories.map((story) => (
            <StoryRing key={story.username} {...story} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

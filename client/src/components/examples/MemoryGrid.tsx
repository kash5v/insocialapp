import MemoryGrid from '../MemoryGrid';

export default function MemoryGridExample() {
  const memories = [
    { id: "1", date: "Jan 15", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop" },
    { id: "2", date: "Feb 3", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=400&fit=crop" },
    { id: "3", date: "Mar 12", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop" },
    { id: "4", date: "Mar 20", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop" },
    { id: "5", date: "Apr 8", imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop" },
    { id: "6", date: "Apr 22", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="font-display font-bold text-2xl mb-4">Your Memories</h2>
      <MemoryGrid memories={memories} />
    </div>
  );
}

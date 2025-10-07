import FeedPost from '../FeedPost';

export default function FeedPostExample() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <FeedPost
        username="priya.sharma"
        displayName="Priya Sharma"
        timestamp="2h"
        caption="Beautiful sunset at Marine Drive 🌅 #Mumbai #India"
        imageUrl="https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=800&fit=crop"
        likes={1234}
        comments={45}
      />
      <FeedPost
        username="raj.patel"
        displayName="Raj Patel"
        timestamp="5h"
        caption="Just launched our new startup! Excited for this journey 🚀"
        likes={892}
        comments={23}
      />
    </div>
  );
}

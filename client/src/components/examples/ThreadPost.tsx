import ThreadPost from '../ThreadPost';

export default function ThreadPostExample() {
  return (
    <div className="max-w-2xl mx-auto bg-card border border-card-border rounded-xl divide-y divide-border">
      <ThreadPost
        username="raj.tech"
        displayName="Raj Patel"
        timestamp="3h"
        content="Just shipped our new feature! 🚀 The team worked incredibly hard on this. Proud moment for all of us. #startup #tech"
        likes={245}
        replies={12}
        reposts={34}
      />
      <ThreadPost
        username="priya.codes"
        displayName="Priya Sharma"
        timestamp="1h"
        content="Congratulations! Can't wait to try it out. Is this the AI feature you mentioned last month?"
        likes={18}
        replies={3}
        reposts={0}
        isReply={true}
      />
    </div>
  );
}

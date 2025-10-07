import ConversationItem from '../ConversationItem';

export default function ConversationItemExample() {
  return (
    <div className="max-w-2xl mx-auto bg-card rounded-xl p-2">
      <ConversationItem
        name="Priya Sharma"
        lastMessage="See you at the cafe! ☕"
        timestamp="2m"
        unreadCount={3}
        isOnline={true}
      />
      <ConversationItem
        name="Tech Enthusiasts"
        lastMessage="Raj: Check out this new AI tool!"
        timestamp="15m"
        unreadCount={12}
        isOnline={false}
      />
      <ConversationItem
        name="Anjali Verma"
        lastMessage="Thanks for the recommendation 😊"
        timestamp="1h"
        unreadCount={0}
        isOnline={true}
      />
    </div>
  );
}

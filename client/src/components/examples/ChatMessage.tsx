import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-background space-y-1">
      <ChatMessage
        message="Hey! How are you doing?"
        timestamp="10:30 AM"
        isSent={false}
      />
      <ChatMessage
        message="I'm doing great! Just finished my work for the day 😊"
        timestamp="10:32 AM"
        isSent={true}
        isDelivered={true}
      />
      <ChatMessage
        message="That's awesome! Want to catch up over coffee?"
        timestamp="10:33 AM"
        isSent={false}
      />
      <ChatMessage
        message="Definitely! See you at the usual place?"
        timestamp="10:35 AM"
        isSent={true}
        isRead={true}
      />
    </div>
  );
}

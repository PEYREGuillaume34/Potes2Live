import MessageList from './MessageList';
import MessageInput from './MessageInput';

type Message = {
  id: number;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

type ChatBoxProps = {
  groupId: number;
  messages: Message[];
  currentUserId: string;
};

export default function ChatBox({ groupId, messages, currentUserId }: ChatBoxProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">💬 Discussion du groupe</h2>
        <span className="text-sm text-blue-100">
          {messages.length} message{messages.length > 1 ? 's' : ''}
        </span>
      </div>
      
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput groupId={groupId} />
    </div>
  );
}
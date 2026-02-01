import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { ChatBoxProps } from "@/app/type";

export default function ChatBox({ groupId, messages, currentUserId }: ChatBoxProps) {
  return (
    <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 border-gray-700 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">💬 Discussion</h2>
        <span className="text-sm text-white/80">
          {messages.length} message{messages.length > 1 ? 's' : ''}
        </span>
      </div>
      
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput groupId={groupId} />
    </div>
  );
}
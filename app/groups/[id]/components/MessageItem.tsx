'use client';

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

type MessageItemProps = {
  message: Message;
  isOwnMessage: boolean;
};

export default function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
        <div className="flex items-center gap-2 mb-1">
          {message.user.image && (
            <img 
              src={message.user.image} 
              alt={message.user.name} 
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className={`text-sm font-semibold ${isOwnMessage ? 'text-white' : 'text-gray-800'}`}>
            {isOwnMessage ? 'Vous' : message.user.name}
          </span>
        </div>
        <p className={`${isOwnMessage ? 'text-white' : 'text-gray-700'} break-words`}>
          {message.content}
        </p>
        <span className={`text-xs mt-1 block ${isOwnMessage ? 'text-blue-100' : 'text-gray-400'}`}>
          {new Date(message.createdAt).toLocaleString('fr-FR', { 
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}
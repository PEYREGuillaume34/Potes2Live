// Props typées
type MessageItemProps = {
  userName: string;
  content: string;
  createdAt: Date;
  isOwn: boolean;
};

// Affichage conditionnel basé sur isOwn
export function MessageItem({ userName, content, createdAt, isOwn }: MessageItemProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
        <div className="flex items-center mb-1">
          {!isOwn && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-500">
            {userName} • {formatTime(createdAt)}
          </span>
        </div>

        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <p className="wrap-break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}


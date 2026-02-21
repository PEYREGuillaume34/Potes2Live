"use client";

import type { MessageListProps } from "@/app/type";

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  return (
    <div className="flex flex-col gap-3 p-4 h-96 overflow-y-auto bg-white/10">
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aucun message pour le moment. Soyez le premier à écrire ! 💬
        </p>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.user.id === currentUserId;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md ${isOwnMessage ? "bg-orange-clair text-white" : " border bg-gray-200"} rounded-lg p-3 shadow-sm`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.user.avatar_url && (
                    <img
                      src={message.user.avatar_url}
                      alt={message.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span
                    className={`text-sm font-semibold ${isOwnMessage ? "text-white/70" : "text-gray-800"}`}
                  >
                    {isOwnMessage ? "Vous" : message.user.name}
                  </span>
                </div>
                <p
                  className={`${isOwnMessage ? "text-white" : "text-gray-700"} font-bold break-words`}
                >
                  {message.content}
                </p>
                <span
                  className={`text-xs mt-1 block ${isOwnMessage ? "text-white/70" : "text-gray-400"}`}
                >
                  {new Date(message.createdAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { sendGroupMessage } from "@/app/actions/messages.actions";
import { useRouter } from "next/navigation";

type ChatFormProps = {
  groupId: number;
};

export function ChatForm({ groupId }: ChatFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    setError("");

    const result = await sendGroupMessage(groupId, message);

    if (result.success) {
      setMessage("");
      router.refresh();
    } else {
      setError(result.error || "Erreur lors de l'envoi");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrire un message..."
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
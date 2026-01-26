'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendGroupMessage } from '@/app/actions/messages.actions';
import { Send } from 'lucide-react';

type MessageInputProps = {
  groupId: number;
};

export default function MessageInput({ groupId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim().length === 0) {
      setError('Le message ne peut pas être vide');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await sendGroupMessage(groupId, content);
      
      if (result.success) {
        setContent(''); // Vider le champ
        router.refresh(); // Rafraîchir la page pour afficher le nouveau message
      } else {
        setError(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t bg-white">
      {error && (
        <div className="px-4 pt-2">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <input
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          placeholder="Tapez votre message..."
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-fonce disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading || content.trim().length === 0}
          className="px-6 py-2 bg-orange-fonce text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
        >
          {isLoading ? 'Envoi...' : <Send />}
        </button>
      </form>
    </div>
  );
}
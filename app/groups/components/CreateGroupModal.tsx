"use client";

import { createGroup } from "@/app/actions/groups.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateGroupModalProps = {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateGroupModal({
  eventId,
  isOpen,
  onClose,
}: CreateGroupModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createGroup(eventId, name, description, maxMembers);

    if (result.success && result.data) {
      // Rediriger vers la page du groupe créé
      router.push(`/groups/${result.data.id}`);
      router.refresh();
      onClose();
      setName("");
      setDescription("");
      setMaxMembers(10);
    } else {
      alert(result.error || "Erreur lors de la création du groupe");
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Créer un nouveau groupe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Les fans de rock"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Décrivez votre groupe..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de membres
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value))}
              min={2}
              max={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

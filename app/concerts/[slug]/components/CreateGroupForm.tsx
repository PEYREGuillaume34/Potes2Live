"use client";
import { createGroup } from "@/app/actions/groups.actions";
import { Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateGroupFormProps = {
  eventId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreateGroupForm({
  eventId,
  onSuccess,
  onCancel,
}: CreateGroupFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createGroup(
      eventId,
      name,
      description,
      maxMembers,
    );

    if (result.success) {
      setName("");
      setDescription("");
      setMaxMembers(10);
      onSuccess && onSuccess();
      router.push(`/groups/${result.data.id}`);
    } else {
      setError(result.error || "Erreur lors de la création du groupe.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-orange-clair">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-x1 font-semibold">
          <Users className="w-5 h-5 text-orange-fonce" />
          Créer un nouveau groupe
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom du groupe */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom du groupe <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Amis de la musique"
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-orange-clair"
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Parlez-nous un peu de votre groupe..."
            className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-orange-clair"
            rows={3}
            maxLength={200}
          />
        </div>

        {/* Nombre max de membres */}
        <div>
          <label
            htmlFor="maxMembers"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre maximum de membres <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-4 mt-1">
            <input
              type="range"
              id="maxMembers"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              min={2}
              max={50}
              className="flex-1"
            />

            <span className="text-lg font-semibold text-orange-fonce w-12 text-center">
              {maxMembers}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Choisissez entre 2 et 50 membres.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex-1 bg-orange-clair text-black font-medium px-4 py-2 rounded hover:bg-orange-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Création..." : "Créer le groupe"}
          </button>
        </div>
      </form>
    </div>
  );
}

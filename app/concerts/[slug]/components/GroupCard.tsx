"use client";

import { deleteGroup, joinGroup, leaveGroup } from "@/app/actions/groups.actions";
import { Divide, Trash2, Users } from "lucide-react";
import { useState } from "react";


type GroupCardProps = {
  group: {
    id: number;
    name: string;
    description: string | null;
    maxMembers: number;
    ownerId: string;
    owner: {
      id: string;
      name: string;
      image: string | null;
    };
    memberCount: number;
  };
  currentUserId?: string;
  userStatus?: {
    isMember: boolean;
    role: "owner" | "member" | null;
    status: "active" | "left" | null;
  };
  onUpdate?: () => void;
};

export function GroupCard({ group, currentUserId, userStatus, onUpdate }: GroupCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isFull = group.memberCount >= group.maxMembers;
    const isOwner = userStatus?.role === "owner";
    const isMember = userStatus?.isMember;

    const handleJoinGroup = async () => {
        setIsLoading(true);
        setError(null);

        const result = await joinGroup(group.id);

        if (result.success) {
            onUpdate && onUpdate();
        } else {
            setError(result.error || "Erreur lors de la tentative de rejoindre.");
        }
        setIsLoading(false);
    };

    const handleLeave = async () => {
    if (!confirm("Êtes-vous sûr de vouloir quitter ce groupe ?")) return;
    setIsLoading(true);
    setError(null);

    const result = await leaveGroup(group.id);

    if (result.success) {
        onUpdate && onUpdate();
    } else {
        setError(result.error || "Erreur lors de la tentative de quitter.");
    }
    setIsLoading(false);
};

const handleDeleteGroup = async() => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.")) return;
    
    setIsLoading(true);
    setError(null);

    const result = await deleteGroup(group.id);

    if (result.success) {
        onUpdate && onUpdate();
    } else {
        setError(result.error || "Erreur lors de la tentative de suppression.");
    }
    setIsLoading(false);
};

return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
                <h2 className="text-lg font-semibold">
                    {group.name}
                    {isOwner && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                            créateur
                            </span>
                        )}
                        </h2>
                        {group.description && (
                            <p className="text-gray-600 text-sm mt-1">{group.description}</p>
                        )}
            </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2 mb-3">
            {group.owner.image ? (
                <img
                    src={group.owner.image}
                    alt={group.owner.name}
                    className="w-8 h-8 rounded-full"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">
                    {group.owner.name[0].toUpperCase()}
                    </span>
                </div>
            )}
            <span className="text-sm text-gray-700">Créé par {group.owner.name}</span>
        </div>

        {/* Members Count */}
<div className="flex items-center gap-2 mb-4">
    <Users className="w-5 h-5 text-gray-500" />
    <span className="text-sm text-gray-700">
        {group.memberCount} / {group.maxMembers} membres
    </span>
      {isFull && !isMember && (
          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
            Complet
          </span>
        )}
</div>

{/* Error Message */}
   {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

       {/* Actions */}
{currentUserId && (
    <div className="flex gap-2">
        {isOwner ? (
            <button
                onClick={handleDeleteGroup}
                disabled={isLoading}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
                <Trash2 className="w-4 h-4 inline-block mr-2" />
                {isLoading ? "Suppression..." : "Supprimer le groupe"}
            </button>
        ) : isMember ? (
            <button
                onClick={handleLeave}
                disabled={isLoading}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
                {isLoading ? "Quitter..." : "Quitter le groupe"}
            </button>
        ) : (
            <button
                onClick={handleJoinGroup}
                disabled={isLoading || isFull}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
                {isLoading ? "Rejoindre..." : "Rejoindre le groupe"}
            </button>
        )}
    </div>
)}

{!currentUserId && (
    <p className="text-sm text-gray-500 italic text-center mt-3">
        Connectez-vous pour rejoindre ce groupe.
    </p>
)}
    </div>
);
}


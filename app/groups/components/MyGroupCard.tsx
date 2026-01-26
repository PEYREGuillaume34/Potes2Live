"use client";

import { useState } from "react";
import { leaveGroup, deleteGroup } from "@/app/actions/groups.actions";
import Link from "next/link";
import { Users, Calendar, MapPin, Trash2, LogOut, Crown, MessageCircle } from "lucide-react";

type MyGroupCardProps = {
  group: {
    id: number;
    name: string;
    description: string | null;
    maxMembers: number;
    createdAt: Date;
    isOwner: boolean;
    memberRole: "owner" | "member";
    memberCount: number;
    event: {
      id: number;
      slug: string;
      title: string;
      imageUrl: string | null;
      eventDate: Date;
      eventTime: string | null;
    };
  };
  onUpdate?: () => void;
};

export function MyGroupCard({ group, onUpdate }: MyGroupCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = async () => {
    if (!confirm("Êtes-vous sûr de vouloir quitter ce groupe ?")) return;

    setIsLoading(true);
    setError(null);

    const result = await leaveGroup(group.id);

    if (result.success) {
      onUpdate?.();
    } else {
      setError(result.error || "Erreur lors de la tentative de quitter");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible et tous les membres seront retirés."
      )
    )
      return;

    setIsLoading(true);
    setError(null);

    const result = await deleteGroup(group.id);

    if (result.success) {
      onUpdate?.();
    } else {
      setError(result.error || "Erreur lors de la suppression");
    }

    setIsLoading(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

   return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Event Image */}
      <div className="relative h-40 bg-gray-200">
        {group.event.imageUrl ? (
          <img
            src={group.event.imageUrl}
            alt={group.event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12" />
          </div>
        )}
        {/* Badge Créateur */}
        {group.isOwner && (
          <div className="absolute top-2 right-2 bg-orange-fonce text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3" />
            Créateur
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Group Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>

        {/* Description */}
        {group.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {group.description}
          </p>
        )}

        {/* Event Info */}
        <Link
          href={`/concerts/${group.event.slug}`}
          className="block mb-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-fonce" />
            {group.event.title}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{formatDate(group.event.eventDate)}</span>
            {group.event.eventTime && <span>• {group.event.eventTime}</span>}
          </div>
        </Link>

        {/* Members Count */}
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {group.memberCount} / {group.maxMembers} membres
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Bouton principal : Accéder au chat */}
          <Link
            href={`/groups/${group.id}`}
            className="flex items-center justify-center gap-2 bg-orange-fonce text-white px-4 py-3 rounded-lg hover:bg-orange-900 transition-colors font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Accéder au chat du groupe
          </Link>

          {/* Actions secondaires */}
          <div className="flex gap-2">
            <Link
              href={`/concerts/${group.event.slug}`}
              className="flex-1 text-center bg-orange-clair text-white px-4 py-2 rounded hover:bg-orange-fonce transition-colors text-sm"
            >
              Voir l'événement
            </Link>

            {group.isOwner ? (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                title="Supprimer le groupe"
              >
                <Trash2 className="w-4 h-4" />
                {isLoading ? "..." : "Supprimer"}
              </button>
            ) : (
              <button
                onClick={handleLeave}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                title="Quitter le groupe"
              >
                <LogOut className="w-4 h-4" />
                {isLoading ? "..." : "Quitter"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
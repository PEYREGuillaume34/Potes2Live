"use client";

import Link from "next/dist/client/link";



type GroupCardProps = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  memberCount: number;
  ownerName: string;
  ownerImage: string | null;
};

export default function GroupCard({
  id,
  name,
  description,
  maxMembers,
  memberCount,
  ownerName,
  ownerImage,
}: GroupCardProps) {
  const isFull = memberCount >= maxMembers;
  const fillPercentage = (memberCount / maxMembers) * 100;

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-lg font-semibold">{name}</h2>
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            isFull ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {memberCount}/{maxMembers}
        </span>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all ${
            isFull ? "bg-red-500" : "bg-purple-600"
          }`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {description || "Aucune description disponible."}
      </p>

      <div className="flex justify-between items-center pt-3 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
            {ownerName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">Créé par {ownerName}</span>
        </div>

        <Link
          href={`/groups/${id}`}
          className="text-purple-600 hover:underline text-sm font-medium flex items-center"
        >
          Voir le groupe
        </Link>
      </div>
    </div>
  );
}

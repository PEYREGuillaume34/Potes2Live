"use client";

import Link from "next/link";

type GroupCardProps = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  memberCount: number;
  ownerName: string;
  ownerImage: string | null;
};

export function GroupCard({
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
    <div className="border border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${
          isFull ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
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

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description || "Aucune description"}
      </p>

      <div className="flex justify-between items-center pt-3 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
            {ownerName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500">Par {ownerName}</span>
        </div>
        
        <Link
          href={`/groups/${id}`}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Voir le groupe
        </Link>
      </div>
    </div>
  );
}
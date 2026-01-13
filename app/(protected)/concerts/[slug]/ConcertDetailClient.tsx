"use client";

import { useState } from "react";
import { CreateGroupModal } from "@/app/components/groups/CreateGroupModal";
import { GroupCard } from "@/app/components/groups/GroupCard";

type Group = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  memberCount: number;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
};

type ConcertDetailClientProps = {
  eventId: number;
  groups: Group[];
};

export function ConcertDetailClient({ eventId, groups }: ConcertDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Groupes disponibles ({groups.length})
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Créer un groupe
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-5xl mb-3">👥</div>
            <p className="mb-2">Aucun groupe n'a encore été créé pour ce concert.</p>
            <p className="text-sm">Soyez le premier à en créer un !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                description={group.description}
                maxMembers={group.maxMembers}
                memberCount={group.memberCount}
                ownerName={group.owner.name}
                ownerImage={group.owner.image}
              />
            ))}
          </div>
        )}
      </div>

      <CreateGroupModal
        eventId={eventId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
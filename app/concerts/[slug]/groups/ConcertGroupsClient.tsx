"use client";

import { useState } from "react";
import CreateGroupModal from "@/app/groups/components/CreateGroupModal";
import GroupCard from "@/app/groups/components/GroupCard";

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

type ConcertGroupsClientProps = {
  eventId: number;
  groups: Group[];
  concertSlug: string;
};

export function ConcertGroupsClient({ eventId, groups, concertSlug }: ConcertGroupsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Groupes disponibles ({groups.length})
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            + Créer un groupe
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-lg mb-2">Aucun groupe n'a encore été créé pour ce concert.</p>
            <p className="text-sm">Soyez le premier à en créer un !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
"use client";

import { getGroupsByEvent, checkUserGroupForEvent, getUserGroupStatus } from "@/app/actions/groups.actions";
import { GroupCard } from "./GroupCard";
import { useSession } from "@/app/lib/auth-client";
import { Loader2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateGroupForm } from "./CreateGroupForm";

type GroupsListProps = {
  eventId: number;
};

type GroupWithMembers = {
  id: number;
  name: string;
  description: string | null;
  maxMembers: number;
  createdAt: Date;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
  memberCount: number;
};

export function GroupsList({ eventId }: GroupsListProps) {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [groupsStatus, setGroupsStatus] = useState<Map<number, any>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [canCreateGroup, setCanCreateGroup] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupérer les groupes
      const groupsResult = await getGroupsByEvent(eventId);

      if (!groupsResult.success) {
        setError(
          groupsResult.error || "Erreur lors de la récupération des groupes.",
        );
        setIsLoading(false);
        return;
      }

      setGroups(groupsResult.data || []);

      // Vérfier si l'utilisateur peut créer un groupe
      if (session?.user) {
        const checkResult = await checkUserGroupForEvent(eventId);
        setCanCreateGroup(!checkResult.hasGroup);

        // Récupérer le statut de l'utilisateur pour chaque groupe
        const statusMap = new Map<number, any>();
        for (const group of groupsResult.data || []) {
          const status = await getUserGroupStatus(group.id);
          if (status.success) {
            statusMap.set(group.id, {
              isMember: status.isMember,
              role: status.role,
              status: status.status,
            });
          }
        }
        setGroupsStatus(statusMap);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [eventId, session]);

  const handleGroupUpdate = () => {
    setShowCreateForm(false);
    fetchGroups();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-clair" />
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-clair" />
          Groupes de l'événement
        </h2>

        {session?.user && canCreateGroup && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}>
            <Plus className="w-8 h-8 text-orange-clair border-2 border-orange-clair rounded" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Create Group Form */}
      {showCreateForm && (
        <div className="mb-6">
          <CreateGroupForm
            eventId={eventId}
            onSuccess={handleGroupUpdate}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Info si user a déjà créé un groupe */}
      {session?.user && !canCreateGroup && !showCreateForm && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700">
          Vous avez déjà créé un groupe pour cet événement
        </div>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="text-center py-12 bg-white/10 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-white text-lg">Aucun groupe pour le moment</p>
          <p className="text-gray-400 text-sm mt-1">
            {session?.user
              ? "Soyez le premier à créer un groupe !"
              : "Connectez-vous pour créer ou rejoindre un groupe"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              currentUserId={session?.user?.id}
              userStatus={groupsStatus.get(group.id)}
              onUpdate={handleGroupUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

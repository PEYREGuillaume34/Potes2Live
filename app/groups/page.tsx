"use client";

import { useEffect, useState } from "react";
import { getMyGroups } from "@/app/actions/groups.actions";
import { useSession } from "@/app/lib/auth-client";
import { MyGroupCard } from "./components/MyGroupCard";
import { Users, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

type MyGroup = {
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

export default function MyGroupsPage() {
  const { data: session, isPending } = useSession();
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyGroups = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getMyGroups();

    if (result.success) {
      setGroups((result.data || []) as MyGroup[]);
    } else {
      setError(result.error || "Erreur lors du chargement de vos groupes");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isPending && session?.user) {
      fetchMyGroups();
    } else if (!isPending && !session) {
      setIsLoading(false);
    }
  }, [session, isPending]);

  const handleGroupUpdate = () => {
    fetchMyGroups();
  };

  // Loading state
  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-clair" />
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="mt-8 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Mes groupes
          </h1>
          <p className="text-gray-400 mb-6">
            Vous devez être connecté pour voir vos groupes
          </p>
          <Link
            href="/login"
            className="inline-block bg-orange-clair text-black font-medium px-6 py-3 rounded hover:bg-orange-600 hover:text-white transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-orange-clair" />
          Mes groupes
        </h1>
        <p className="text-gray-400">
          Gérez vos groupes et suivez vos événements à venir
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Erreur</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-lg border-2 border-dashed border-white/10">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Aucun groupe pour le moment
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Explorez les événements et rejoignez ou créez un groupe pour
            partager votre passion avec d'autres fans !
          </p>
          <Link
            href="/concerts"
            className="inline-block bg-orange-clair text-black font-medium px-6 py-3 rounded hover:bg-orange-600 hover:text-white transition-colors"
          >
            Découvrir les événements
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-orange-clair mb-1">
                {groups.length}
              </div>
              <div className="text-sm text-gray-400">
                {groups.length > 1 ? "Groupes" : "Groupe"}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold text-orange-clair mb-1">
                {groups.filter((g) => g.isOwner).length}
              </div>
              <div className="text-sm text-gray-400">Créés par vous</div>
            </div>
             
            </div>
         

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <MyGroupCard
                key={group.id}
                group={group}
                onUpdate={handleGroupUpdate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
import { getUserGroups } from "../actions/groups.actions";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function GroupsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-bold mb-6">Mes Groupes</h1>
        <p className="text-gray-400 mb-4">Connectez-vous pour voir vos groupes</p>
        <Link href="/login" className="text-purple-400 hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  const result = await getUserGroups();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white text-3xl font-bold mb-6">Mes Groupes</h1>
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  const groups = result.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-white text-3xl font-bold">Mes Groupes</h1>
        <Link
          href="/concerts"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Trouver un concert
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-gray-600 text-lg mb-4">
            Vous n'êtes membre d'aucun groupe pour le moment.
          </p>
          <Link
            href="/concerts"
            className="text-purple-600 hover:underline font-medium text-lg"
          >
            Découvrir des concerts et rejoindre des groupes →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="border border-gray-700 rounded-lg p-6 hover:shadow-xl transition-all bg-white hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
                {group.userRole === "owner" && (
                  <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Propriétaire
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {group.description || "Aucune description disponible."}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  👥 {group.memberCount} / {group.maxMembers} membres
                </span>
                <span className="text-xs text-gray-500">
                  Event #{group.eventId}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

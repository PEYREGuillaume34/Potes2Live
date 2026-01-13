import { getGroupById, getGroupMembers, isUserMemberOfGroup } from "@/app/actions/groups.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JoinGroupButton } from "@/app/(protected)/groups/[id]/JoinGroupButton";
import { LeaveGroupButton } from "@/app/(protected)/groups/[id]/LeaveGroupButton";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function GroupDetailPage({ params }: PageProps) {
  const { id } = await params;
  const groupId = parseInt(id);
  console.log("Group ID:", groupId);

  if (isNaN(groupId)) {
    notFound();
  }

  // Récupérer les données du groupe
  const groupResult = await getGroupById(groupId);
  if (!groupResult.success || !groupResult.data) {
    notFound();
  }

  const group = groupResult.data;

  // Récupérer les membres
  const membersResult = await getGroupMembers(groupId);
  const members = membersResult.success && membersResult.data ? membersResult.data : [];
  console.log(members);

  // Vérifier si l'utilisateur est membre
  const membershipResult = await isUserMemberOfGroup(groupId);
  const isMember = membershipResult.isMember;
  const userRole = membershipResult.role;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {group.name}
              </h1>
              <p className="text-gray-600">
                {members.length}/{group.maxMembers} membres
              </p>
            </div>

            {/* Badge statut */}
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              members.length >= group.maxMembers
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}>
              {members.length >= group.maxMembers ? "Complet" : "Places disponibles"}
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all ${
                members.length >= group.maxMembers ? "bg-red-500" : "bg-purple-600"
              }`}
              style={{ width: `${(members.length / group.maxMembers) * 100}%` }}
            />
          </div>

          {/* Description */}
          {group.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-700">{group.description}</p>
            </div>
          )}

          {/* Créé par */}
          {group.owner && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <span>Créé par</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                  {group.owner.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{group.owner.name}</span>
              </div>
              <span>•</span>
              <span>{formatDate(group.createdAt)}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            {!isMember ? (
              <JoinGroupButton groupId={groupId} isFull={members.length >= group.maxMembers} />
            ) : (
              <>
                <Link
                  href={`/groups/${groupId}/chat`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
                >
                  💬 Discussion
                </Link>
                {userRole !== "owner" && (
                  <LeaveGroupButton groupId={groupId} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Liste des membres */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Membres ({members.length})
          </h2>

          {members.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun membre pour le moment</p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{member.user.name}</p>
                      <p className="text-sm text-gray-500">
                        Membre depuis {formatDate(member.joinedAt)}
                      </p>
                    </div>
                  </div>

                  {member.role === "owner" && (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                      👑 Créateur
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
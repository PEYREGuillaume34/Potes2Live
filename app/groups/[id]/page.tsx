import { getGroupById, getGroupMembers, isUserMemberOfGroup } from "@/app/actions/groups.actions";
import { notFound } from "next/navigation";
import { JoinGroupButton } from "./JoinGroupButton";
import { LeaveGroupButton } from "./LeaveGroupButton";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};

export default async function GroupDetailPage({ params }: PageProps) {
  const groupId = parseInt((await params).id);
  
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-white">Connectez-vous pour voir ce groupe</p>
        <Link href="/login" className="text-purple-400 underline">Se connecter</Link>
      </div>
    );
  }

  const groupResult = await getGroupById(groupId);
  const membersResult = await getGroupMembers(groupId);
  const membershipResult = await isUserMemberOfGroup(groupId);

  if (!groupResult.success || !groupResult.data) {
    notFound();
  }

  const group = groupResult.data;
  const members = membersResult.success ? membersResult.data : [];
  const isMember = membershipResult.success && membershipResult.isMember;
  const userRole = membershipResult.success ? membershipResult.role : null;
  const isOwner = userRole === "owner";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.name}</h1>
            <p className="text-gray-600">{group.description}</p>
          </div>
          
          {isOwner && (
            <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Propriétaire
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            👥 {members?.length || 0} / {group.maxMembers} membres
          </span>
          <span>•</span>
          <span>Créé le {new Date(group.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${((members?.length || 0) / group.maxMembers) * 100}%` }}
          />
        </div>

        <div className="flex gap-3">
          {!isMember ? (
            <JoinGroupButton 
              groupId={groupId} 
              isFull={(members?.length || 0) >= group.maxMembers}
            />
          ) : !isOwner ? (
            <LeaveGroupButton groupId={groupId} />
          ) : null}
          
          <button
            disabled
            className="bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium cursor-not-allowed"
          >
            💬 Discussion (bientôt)
          </button>
        </div>
      </div>

      {/* Liste des membres */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Membres du groupe
        </h2>

        {members && members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div 
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{member.user.name}</p>
                    <p className="text-sm text-gray-500">
                      Membre depuis {new Date(member.joinedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                
                {member.role === "owner" && (
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Propriétaire
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucun membre pour le moment.</p>
        )}
      </div>
    </div>
  );
}
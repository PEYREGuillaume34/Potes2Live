import { auth } from "@/app/lib/auth";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getGroupById, getGroupMembers } from "@/app/actions/groups.actions";
import { getGroupMessages } from "@/app/actions/messages.actions";
import ChatBox from "./components/ChatBox";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const groupId = parseInt(id);

  if (isNaN(groupId)) {
    notFound();
  }

  // Récupérer la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Vérifier que l'utilisateur est membre du groupe
  const membersResponse = await getGroupMembers(groupId);

  if (!membersResponse.success || !membersResponse.isMember) {
    redirect("/groups");
  }

  // Récupérer les infos du groupe
  const groupResponse = await getGroupById(groupId);
  if (!groupResponse || !groupResponse.success || !groupResponse.data) {
    notFound();
  }
  const group = groupResponse.data;

  // Récupérer les messages du groupe
  const messagesResponse = await getGroupMessages(groupId);
  const messages = messagesResponse.success && messagesResponse.data ? messagesResponse.data : [];

  // Récupérer les membres du groupe
  const members = membersResponse.success ? membersResponse.data : [];

  return (
    <div className="bg-black">
      {/* En-tête fixe */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-700 z-10">
        <div className="flex gap-2 px-5 py-4">
          <Link href="/groups" aria-label="Retour aux groupes">
            <ChevronLeft className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-orange-clair text-2xl font-bold">
            {group.name}
          </h1>
        </div>
      </header>

      {/* Contenu principal avec padding pour le header fixe */}
      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="mb-6 rounded-lg shadow p-6">
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-orange-clair mb-2">
              Description
            </h2>
            {group.description && (
              <p className="text-white mt-2">{group.description}</p>
            )}
          </div>

          {/* Liste des membres */}
          <div className="border-t pt-4 text-white mb-6">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">
              Membres ({members.length}/{group.maxMembers})
            </h3>

            <div className="flex flex-wrap gap-2">
              {members.map((member: any) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-2 px-1 py-1 rounded-full text-sm
                    ${member.role === "owner"
                      ? "border border-orange-500 text-orange-500 bg-black"
                      : "border border-gray-300 text-gray-700 bg-black"}`}
                >
                  {member.user.image ? (
                    <img
                      src={member.user.image}
                      alt={member.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                        ${member.role === "owner"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 text-gray-700"
                        }
                      `}
                    >
                      {member.user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <ChatBox
            groupId={groupId}
            messages={messages}
            currentUserId={session.user.id}
          />
        </div>
      </div>
    </div>
  );
}




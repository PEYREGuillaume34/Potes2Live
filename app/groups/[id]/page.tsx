import { auth } from "@/app/lib/auth";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getGroupById, getGroupMembers } from "@/app/actions/groups.actions";
import { getGroupMessages } from "@/app/actions/messages.actions";
import ChatBox from "./components/ChatBox";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ChatPage({ params }: PageProps) {
  const { id } = params;
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
  
  // CORRECTION ICI : vérifier la propriété isMember correctement
  if (!membersResponse.success || !membersResponse.isMember) {
    redirect("/groups");
  }

  // Récupérer les infos du groupe
  const groupResponse = await getGroupById(groupId);
  if (!groupResponse || !groupResponse.success) {
    notFound();
  }
  const group = groupResponse.data;

  // Récupérer les messages du groupe
  const messagesResponse = await getGroupMessages(groupId);
  const messages = messagesResponse.success ? messagesResponse.data : [];

  // Récupérer les membres du groupe
  const members = membersResponse.success ? membersResponse.data : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête du groupe */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{group.name}</h1>
              {group.description && (
                <p className="text-gray-600 mt-2">{group.description}</p>
              )}
            </div>
            <Link 
              href="/groups" 
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              ← Retour aux groupes
            </Link>
          </div>

          {/* Liste des membres */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Membres ({members.length}/{group.maxMembers})
            </h3>
            <div className="flex flex-wrap gap-2">
              {members.map((member: any) => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  {member.image && (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">{member.name}</span>
                  {member.role === 'owner' && (
                    <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded">
                      Chef
                    </span>
                  )}
                </div>
              ))}
            </div>
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
  );
}
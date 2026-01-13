import { getGroupMessages } from "@/app/actions/messages.actions";
import { getGroupById, isUserMemberOfGroup } from "@/app/actions/groups.actions";
import { redirect, notFound } from "next/navigation";
import { ChatForm } from "./ChatForm";
import { MessageItem } from "@/app/components/groups/MessageItem";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

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

  // Récupérer la session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Vérifier que l'utilisateur est membre
  const membershipResult = await isUserMemberOfGroup(groupId);
  if (!membershipResult.isMember) {
    redirect("/concerts");
  }

  // Récupérer les infos du groupe
  const groupResult = await getGroupById(groupId);
  if (!groupResult.success || !groupResult.data) {
    notFound();
  }

  const group = groupResult.data;

  // Récupérer les messages
  const messagesResult = await getGroupMessages(groupId);
  const messages = messagesResult.success ? messagesResult.data : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href={`/groups/${groupId}`}
              className="text-purple-600 hover:text-purple-700 text-sm mb-1 inline-block"
            >
              ← Retour au groupe
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">{group.name}</h1>
            <p className="text-sm text-gray-500">Chat de groupe</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-5xl mb-3">💬</p>
              <p>Aucun message pour le moment.</p>
              <p className="text-sm mt-2">Soyez le premier à écrire !</p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  userName={msg.user.name}
                  content={msg.content}
                  createdAt={msg.createdAt}
                  isOwn={msg.user.id === session.user.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Formulaire */}
      <ChatForm groupId={groupId} />
    </div>
  );
}
import { getConcertBySlug } from "@/app/actions/concerts.action";
import { getGroupsByEvent } from "@/app/actions/groups.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConcertGroupsClient } from "./ConcertGroupsClient";

type PageProps = {
  params: { slug: string };
};

export default async function ConcertGroupsPage({ params }: PageProps) {
  const { slug } = await params;
  const concertResult = await getConcertBySlug(slug);

  if (!concertResult.success || !concertResult.data) {
    notFound();
  }

  const concert = concertResult.data;
  const groupsResult = await getGroupsByEvent(concert.id);

  const groups = groupsResult.success && groupsResult.data 
    ? groupsResult.data.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description,
        maxMembers: g.maxMembers,
        memberCount: g.memberCount,
        owner: {
          id: g.ownerId.id,
          name: g.ownerId.name,
          image: g.ownerId.image,
        }
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href={`/concerts/${slug}`}
          className="text-purple-400 hover:text-purple-300 mb-4 inline-block"
        >
          ← Retour au concert
        </Link>
        <h1 className="text-white text-3xl font-bold mb-2">
          Groupes pour {concert.title}
        </h1>
        <p className="text-gray-400">
          {concert.artist.name} • {new Date(concert.eventDate).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <ConcertGroupsClient 
        eventId={concert.id} 
        groups={groups}
        concertSlug={slug}
      />
    </div>
  );
}
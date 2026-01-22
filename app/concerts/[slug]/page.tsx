import { getConcertBySlug } from "@/app/actions/concerts.action";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth.actions";

type PageProps = {
  params: { slug: string };
};

export default async function ConcertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const concertResult = await getConcertBySlug(slug);
  const session = await getCurrentUser();

  if (!concertResult.success || !concertResult.data) {
    notFound();
  }

  const concert = concertResult.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {concert.artist.imageUrl && (
        <img
          src={concert.artist.imageUrl}
          alt={concert.artist.name}
          className="mb-4 w-full max-w-md rounded-lg"
        />
      )}
      <h1 className="text-orange-clair text-3xl font-bold mb-4">
        {concert.title}
      </h1>
      <p className="text-white text-[1.3rem] mb-2">🎤 {concert.artist.name}</p>
      <p className="text-white text-[1.1rem] mb-2">
        🌏 {concert.venue.name} - {concert.venue.city}
      </p>
      <div className="flex mb-4 gap-2.5 text-[1.05rem]">
        <p className="text-white mb-2">
          📅 {new Date(concert.eventDate).toLocaleDateString("fr-FR")}
        </p>
        <p className="text-white mb-2">🕒 {concert.eventTime}</p>
      </div>

      <p className="text-white mb-6">{concert.description}</p>

      {session ? (
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            href={`/concerts/${slug}/groups`}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            👥 Voir les groupes
          </Link>
          
          <Link
            href={concert.ticketUrl}
            className="bg-orange-clair hover:bg-orange-600 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            target="_blank"
          >
            🎫 Acheter des places
          </Link>
        </div>
      ) : (
        <Link 
          href="/login"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg inline-block"
        >
          Connecte-toi pour rejoindre un groupe
        </Link>
      )}
    </div>
  );
}

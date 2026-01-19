import { getConcertBySlug } from "@/app/actions/concerts.action";
import { notFound } from "next/dist/client/components/navigation";
import { title } from "process";

type PageProps = {
  params: { slug: string };
};

export default async function ConcertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const concertResult = await getConcertBySlug(slug);

  if (!concertResult.success || !concertResult.data) {
    notFound();
  }

  const concert = concertResult.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {concert.imageUrl && (
        <img
          src={concert.imageUrl}
          alt={concert.title}
          className="mb-4 w-full max-w-md"
        />
      )}
      <h1 className="text-orange-clair text-3xl font-bold mb-4">{concert.title}</h1>
      <p className="text-white mb-2">Artiste: {concert.artist.name}</p>
      <p className="text-white mb-2">
        Lieu: {concert.venue.name} - {concert.venue.city}
      </p>
      <p className="text-white mb-2">
        Date: {new Date(concert.eventDate).toLocaleDateString("fr-FR")}
      </p>
      <p className="text-white mb-4">Heure: {concert.eventTime}</p>

      <p className="text-white mb-4">{concert.description}</p>
      {concert.ticketUrl && (
        <a
          href={concert.ticketUrl}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Acheter des billets
        </a>
      )}
    </div>
  );
}

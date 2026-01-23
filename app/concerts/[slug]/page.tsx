import { getConcertBySlug } from "@/app/actions/concerts.action";
import { notFound } from "next/dist/client/components/navigation";
import { GroupsList } from "./components/GroupsList";

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
        {/* {concert.ticketUrl && (
          <a
            href={concert.ticketUrl}
            className="inline-block bg-orange-clair text-black font-medium px-4 py-2 rounded hover:bg-orange-600 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acheter des billets
          </a>
        )} */}
      

      {/* Section Groupes */}
      <GroupsList eventId={concert.id} />
    </div>
  );
}
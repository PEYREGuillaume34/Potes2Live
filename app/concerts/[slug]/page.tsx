import { getConcertBySlug } from "@/app/actions/concerts.action";
import { notFound } from "next/dist/client/components/navigation";
import { GroupsList } from "./components/GroupsList";
import { CalendarDays, ChevronLeft, Clock, MapPin, MicVocal } from "lucide-react";
import Link from "next/dist/client/link";

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
        <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-700">
        <div className="flex gap-2 px-5 py-4">
        <Link
          href="/concerts"
          aria-label="Retour aux concerts"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </Link>
        <h1 className="text-orange-clair text-2xl font-bold">
          {concert.title}
        </h1>
      </div>
      </header>
      {concert.artist.imageUrl && (
        <img
          src={concert.artist.imageUrl}
          alt={concert.artist.name}
          className="mb-6 w-full max-w-md rounded-lg"
        />
      )}
      <div>
        <div className="flex mb-3 gap-2.5 text-[1.3rem]">
        <MicVocal className="text-orange-clair"/> 
        <p className="text-white text-[1.3rem] mb-2">
        {concert.artist.name}
        </p>
        </div>
        <div className="flex mb-3 gap-2.5 text-[1.1rem]">
        <MapPin className="text-orange-clair"/>
        <p className="text-white text-[1.1rem] mb-2">
        {concert.venue.name} - {concert.venue.postalCode} {concert.venue.city}
        </p>
        </div>

        <div className="flex mb-4 gap-2.5 text-[1.05rem]">
          <CalendarDays className="text-orange-clair size-5.5" />
          <p className="text-white mb-2">
          {new Date(concert.eventDate).toLocaleDateString("fr-FR")}
          </p>
          <Clock className="text-orange-clair size-5.5" /> 
          <p className="text-white mb-2">{concert.eventTime}</p>
        </div>
      </div>

      <p className="text-white mb-6">{concert.description}</p>
      {concert.ticketUrl && (
          <a
            href={concert.ticketUrl}
            className="inline-block bg-orange-clair text-black font-medium px-4 py-2 rounded hover:bg-orange-600 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acheter des billets
          </a>
        )}

      {/* Section Groupes */}
      <GroupsList eventId={concert.id} />
    </div>
  );
}

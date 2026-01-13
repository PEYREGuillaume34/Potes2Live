import { getConcertBySlug } from "@/app/actions/concerts.actions";
import { getGroupsByEventId } from "@/app/actions/groups.actions";
import { ConcertDetailClient } from "@/app/(protected)/concerts/[slug]/ConcertDetailClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ConcertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getConcertBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const concert = result.data;

  // Récupérer les groupes pour ce concert
  const groupsResult = await getGroupsByEventId(concert.id);
  const groups = groupsResult.success ? groupsResult.data : [];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-purple-600 to-blue-600">
        {concert.imageUrl && (
          <Image
            src={concert.imageUrl}
            alt={concert.title}
            fill
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <div className="text-white">
            <p className="text-purple-300 font-semibold mb-2">
              {concert.artist.genre}
            </p>
            <h1 className="text-5xl font-bold mb-4">{concert.title}</h1>
            <p className="text-2xl mb-2">{concert.artist.name}</p>
            <div className="flex items-center space-x-4 text-lg">
              <span>📅 {formatDate(concert.eventDate)}</span>
              {concert.eventTime && <span>🕐 {concert.eventTime}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                À propos de cet événement
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {concert.description || "Aucune description disponible."}
              </p>
            </div>

            {/* Artiste */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                L'artiste
              </h2>
              <div className="flex items-start space-x-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-500 flex-shrink-0">
                  {concert.artist.imageUrl ? (
                    <Image
                      src={concert.artist.imageUrl}
                      alt={concert.artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-3xl">
                      🎤
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {concert.artist.name}
                  </h3>
                  <p className="text-purple-600 mb-3">{concert.artist.genre}</p>
                  <p className="text-gray-700 mb-4">
                    {concert.artist.bio || "Aucune biographie disponible."}
                  </p>
                  <div className="flex space-x-3">
                    {concert.artist.spotifyUrl && (
                      <a
                        href={concert.artist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        🎵 Spotify
                      </a>
                    )}
                    {concert.artist.instagramUrl && (
                      <a
                        href={concert.artist.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        📸 Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Groupes */}
            <ConcertDetailClient eventId={concert.id} groups={groups} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Infos pratiques */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-xl mb-4 text-gray-800">
                Informations pratiques
              </h3>

              <div className="space-y-4">
                {/* Prix */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Prix</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {concert.price ? `${concert.price}€` : "Gratuit"}
                  </p>
                </div>

                {/* Lieu */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Lieu</p>
                  <p className="font-semibold text-gray-800">
                    {concert.venue.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {concert.venue.address}
                  </p>
                  <p className="text-sm text-gray-600">{concert.venue.city}</p>
                </div>

                {/* Capacité */}
                {concert.venue.capacity && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Capacité</p>
                    <p className="font-semibold text-gray-800">
                      {concert.venue.capacity.toLocaleString()} personnes
                    </p>
                  </div>
                )}

                {/* Bouton billeterie */}
                {concert.ticketUrl && (
                  <a
                    href={concert.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
                  >
                    🎫 Acheter des billets
                  </a>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";

type ConcertCardProps = {
  slug: string;
  title: string;
  imageUrl: string | null;
  artistName: string;
  artistGenre: string | null;
  venueName: string;
  venueCity: string;
  date: Date;
  time: string | null;
  price: number | null;
};

export function ConcertCard({
  slug,
  title,
  imageUrl,
  artistName,
  artistGenre,
  venueName,
  venueCity,
  date,
  time,
  price,
}: ConcertCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link href={`/concerts/${slug}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white text-6xl">
              🎵
            </div>
          )}
          {/* Badge Genre */}
          {artistGenre && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {artistGenre}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-1">
            {title}
          </h3>
          
          <p className="text-purple-600 font-semibold text-lg mb-3">
            {artistName}
          </p>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span className="line-clamp-1">
                {venueName}, {venueCity}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>
                {formatDate(date)}
                {time && ` • ${time}`}
              </span>
            </div>
          </div>

          {/* Prix */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">
              {price ? `${price}€` : "Gratuit"}
            </span>
            <span className="text-purple-600 font-semibold text-sm">
              Voir plus →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
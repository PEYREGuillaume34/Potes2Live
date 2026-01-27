import { CalendarDays, Clock, MapPin } from "lucide-react";
import Link from "next/link";

type ConcertCardProps = {
  slug: string;
  title: string;
  imageUrl: string | null;
  artistName: string;
  artistImageUrl: string | null;
  artistGenre: string | null;
  venueName: string;
  venueCity: string;
  venuePostalCode: string;
  date: Date;
  time: string | null;
  price: number | null;
  groupCount: number;
};

export function ConcertCard({
  slug,
  title,
  imageUrl,
  artistName,
  artistGenre,
  artistImageUrl,
  venueName,
  venueCity,
  venuePostalCode,
  date,
  time,
  price,
  groupCount,
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 w-full bg-gray-200 relative">
             {/* Image */}
          {imageUrl ? (
            <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white bg-gray-400">
                Image non disponible
            </div>
            )}
            {/* Badge Genre */}
        {artistGenre && (
            <div className="absolute top-2 left-2 bg-orange-fonce text-white text-xs px-2 py-1 rounded">
                {artistGenre}
            </div>
        )}

          
        </div>

        {/* Content */}
       <div className="p-5">
          <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center gap-3">
            {artistImageUrl ? (
            <img
              src={artistImageUrl}
              alt={artistName}
            className="w-8 h-8 rounded-full mb-2"
          />
          ) : (
            <div className="flex items-center justify-center h-8 w-8 text-white bg-gray-400 rounded-full mb-2">
              Image non disponible
            </div>
          )}

          <p className="text-orange-fonce font-semibold text-lg mb-2">
            {artistName}
          </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2"><MapPin className="text-orange-fonce" /></span>
              <span className="line-clamp-1">
                {venueName}, {venuePostalCode} {venueCity}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span><CalendarDays className="text-orange-fonce size-5" /></span>
                {formatDate(date)}
                <Clock className="text-orange-fonce size-5" />
              <span>
                {time && ` ${time}`}
              </span>
            </div>
          </div>

          {/* Prix */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-fonce">
              {price ? `${price}€` : "Gratuit"}
            </span>

             <span className="text-md text-gray-500">
              {groupCount > 0 ? `${groupCount} groupe${groupCount > 1 ? 's' : ''}` : 'Aucun groupe'}
            </span>
            
          </div>
        </div>
      </div>
    </Link>
  );
}


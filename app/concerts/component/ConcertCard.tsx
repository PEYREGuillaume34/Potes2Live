import Link from "next/link";
import React from "react";

type ConcertCardProps = {
  slug: string;
  title: string;
  imageUrl: string | null;
  artistName: string;
  artistGenre: string | null;
  venueName: string;
  venueCity: string;
  venuePostalCode: string;
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
  venuePostalCode,
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
  console.log("Rendering ConcertCard for:", artistName);

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
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 mb-1">Artiste: {artistName}</p>
            <p className="text-gray-600 mb-1">Lieu: {venueName}, {venueCity}, {venuePostalCode}</p>
            <p className="text-gray-600 mb-1">Date: {formatDate(date)}</p>
            {time && <p className="text-gray-600 mb-1">Heure: {time}</p>}
            {price !== null ? (
                <p className="text-gray-600">Prix: {price} €</p>
            ) : (
                <p className="text-gray-600">Prix: Gratuit</p>
            )}
        </div>
      </div>

    </Link>
  );
}

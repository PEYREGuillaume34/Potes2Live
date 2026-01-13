"use client";

import { useState } from "react";
import { ConcertCard } from "@/app/components/concerts/ConcertCard";
import { ConcertFilters } from "@/app/components/concerts/ConcertFilters";

type Concert = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  eventDate: Date;
  eventTime: string | null;
  price: number | null;
  artist: {
    id: number;
    name: string;
    genre: string | null;
    imageUrl: string | null;
  };
  venue: {
    id: number;
    name: string;
    city: string;
    address: string | null;
  };
};

type ConcertsClientProps = {
  concerts: Concert[];
};

export function ConcertsClient({ concerts }: ConcertsClientProps) {
  const [selectedCity, setSelectedCity] = useState("Toutes les villes");

  // Filtrer les concerts par ville
  const filteredConcerts = concerts.filter((concert) => {
    if (selectedCity === "Toutes les villes") return true;
    return concert.venue.city === selectedCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-gray-800">
        Concerts à venir
      </h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        Découvrez {concerts.length} concerts disponibles
      </p>

      {/* Filtres */}
      <ConcertFilters
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />

      {/* Liste des concerts */}
      {filteredConcerts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun concert trouvé
          </h3>
          <p className="text-gray-500">
            Aucun concert ne correspond à vos critères dans cette ville.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredConcerts.map((concert) => (
            <ConcertCard
              key={concert.id}
              slug={concert.slug}
              title={concert.title}
              imageUrl={concert.imageUrl}
              artistName={concert.artist.name}
              artistGenre={concert.artist.genre}
              venueName={concert.venue.name}
              venueCity={concert.venue.city}
              date={concert.eventDate}
              time={concert.eventTime}
              price={concert.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { ConcertCard } from "./component/ConcertCard";
import type { ConcertsClientProps } from "@/app/type";

const PARIS_ARRONDISSEMENTS = [
  75001, 75002, 75003, 75004, 75005, 75006, 75007, 75008, 75009, 75010,
  75011, 75012, 75013, 75014, 75015, 75016, 75017, 75018, 75019, 75020,
];

const CITIES = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nantes"];

export function ConcertsClient({
  concerts,
  initialCity,
  initialPostalCode,
}: ConcertsClientProps) {
  const router = useRouter();

  // Fonction générique pour changer de ville
  const handleCitySelect = (city: string) => {
    if (initialCity === city) {
      // Si on clique sur la ville déjà active, on réinitialise tout
      router.push("/concerts");
    } else {
      // Sinon, on change de ville (et on perd le code postal précédent)
      router.push(`/concerts?city=${city}`);
    }
  };

  const handleArrondissement = (code: number) => {
    router.push(`/concerts?city=Paris&postalCode=${code}`);
  };

  return (
    <div>
      {/* 1. FILTRES DES VILLES (Carousel horizontal) */}
      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              initialCity === city
                ? "bg-orange-fonce text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* 2. ARRONDISSEMENTS (Uniquement si Paris est sélectionné) */}
      {initialCity === "Paris" && (
        <div className="mt-2 relative animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar scroll-smooth">
            <div className="flex flex-nowrap gap-2">
              {PARIS_ARRONDISSEMENTS.map((code) => (
                <button
                  key={code}
                  onClick={() => handleArrondissement(code)}
                  className={`flex-shrink-0 px-2 py-1 rounded-full text-sm font-medium transition-colors ${
                    initialPostalCode === code.toString()
                      ? "bg-orange-fonce text-white shadow-lg"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {code.toString().slice(-2)}ᵉ
                </button>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* 3. LISTE DES CONCERTS */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {concerts.length > 0 ? (
          concerts.map((concert) => (
            <ConcertCard
              key={concert.id}
              slug={concert.slug}
              title={concert.title}
              imageUrl={concert.imageUrl}
              artistName={concert.artist.name}
              artistGenre={concert.artist.genre}
              artistImageUrl={concert.artist.imageUrl}
              venueName={concert.venue.name}
              venueCity={concert.venue.city}
              venuePostalCode={concert.venue.postalCode}
              date={concert.eventDate}
              time={concert.eventTime}
              price={concert.price}
              groupCount={concert.groupCount}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-10">
            Aucun concert trouvé pour cette sélection.
          </p>
        )}
      </div>
    </div>
  );
}
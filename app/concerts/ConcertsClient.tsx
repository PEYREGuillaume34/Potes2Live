"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filtrage des concerts par mots-clés
  const filteredConcerts = useMemo(() => {
    if (!searchQuery.trim()) {
      return concerts;
    }

    const query = searchQuery.toLowerCase().trim();

    return concerts.filter((concert) => {
      // Recherche dans le titre du concert
      if (concert.title.toLowerCase().includes(query)) return true;

      // Recherche dans le nom de l'artiste
      if (concert.artist.name.toLowerCase().includes(query)) return true;

      // Recherche dans le genre
      if (concert.artist.genre?.toLowerCase().includes(query)) return true;

      // Recherche dans la ville
      if (concert.venue.city.toLowerCase().includes(query)) return true;

      // Recherche dans le nom de la salle
      if (concert.venue.name.toLowerCase().includes(query)) return true;

      return false;
    });
  }, [concerts, searchQuery]);

  return (
    <div>
      {/* BARRE DE RECHERCHE */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par artiste, genre, ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-fonce focus:ring-2 focus:ring-orange-fonce/20 transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-400">
            {filteredConcerts.length} résultat{filteredConcerts.length > 1 ? "s" : ""} trouvé{filteredConcerts.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* FILTRES DES VILLES (Carousel horizontal) */}
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

      {/* ARRONDISSEMENTS (Uniquement si Paris est sélectionné) */}
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

      {/* LISTE DES CONCERTS */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcerts.length > 0 ? (
          filteredConcerts.map((concert) => (
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
            {searchQuery
              ? `Aucun concert trouvé pour "${searchQuery}"`
              : "Aucun concert trouvé pour cette sélection."}
          </p>
        )}
      </div>
    </div>
  );
}
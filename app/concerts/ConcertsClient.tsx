"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";
import { ConcertCard } from "./component/ConcertCard";

const PARIS_ARRONDISSEMENTS = [
  75001, 75002, 75003, 75004,
  75005, 75006, 75007, 75008,
  75009, 75010, 75011, 75012,
  75013, 75014, 75015, 75016,
  75017, 75018, 75019, 75020,
];

export function ConcertsClient({ 
  concerts,
  initialCity,
  initialPostalCode 
}: { 
  concerts: any[];
  initialCity?: string;
  initialPostalCode?: string;
}) {
  const router = useRouter();
  const [showArrondissements, setShowArrondissements] = useState(initialCity === "Paris");
  const [showCity, setShowCity] = useState(false);

  const handleParisFilter = () => {
    if (showArrondissements) {
      // Désactiver le filtre
      router.push("/concerts");
      setShowArrondissements(false);
    } else {
      // Activer le filtre Paris
      router.push("/concerts?city=Paris");
      setShowArrondissements(true);
    } if (showCity) {
      setShowCity(true);
      router.push(`/concerts?city=${initialCity}`);
    }
  };

  const handleArrondissement = (code: number) => {
    router.push(`/concerts?city=Paris&postalCode=${code}`);
  };

  return (
    <div>
      {/* FILTRES */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleParisFilter}
          className={`px-4 py-2 rounded-lg font-medium ${
            showArrondissements ? "bg-orange-fonce text-white" : "bg-gray-100"
          }`}
        >
          Paris
        </button>
      </div>

      {/* ARRONDISSEMENTS */}
    {showArrondissements && (
  <div className="mt-4 relative">
    <div 
      className="flex overflow-x-auto gap-3 pb-4 no-scrollbar scroll-smooth"
      style={{
        scrollbarWidth: 'none', // Pour Firefox
        msOverflowStyle: 'none', // Pour IE/Edge
      }}
    >
      {/* On ajoute un petit padding à gauche pour que le premier bouton soit aligné */}
      <div className="flex flex-nowrap gap-2">
        {PARIS_ARRONDISSEMENTS.map((code) => (
          <button
            key={code}
            onClick={() => handleArrondissement(code)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
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
    
    {/* Optionnel: Petit dégradé sur les bords pour indiquer qu'il y a une suite */}
    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
  </div>
)}

      {/* LISTE */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {concerts.map((concert) => (
          <ConcertCard
          key={concert.id}
          slug={concert.slug}
          title={concert.title}
          imageUrl={concert.imageUrl}
          artistName={concert.artist.name}
          artistGenre={concert.artist.genre}
          venueName={concert.venue.name}
          venueCity={concert.venue.city}
          venuePostalCode={concert.venue.postalCode}
          date={concert.eventDate}
          time={concert.eventTime}
          price={concert.price}
          />
        ))}
      </div>
    </div>
  );
}

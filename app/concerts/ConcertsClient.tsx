"use client";

import { useState } from "react";
import { ConcertCard } from "./component/ConcertCard";


export function ConcertsClient({ concerts }: { concerts: any[] }) {
  const [selectedZone, setSelectedZone] = useState<string>("Toutes les zones");

  const ZONES = [
      "Toutes les zones",
    "Paris Centre (1-4)",
    "Paris Ouest (7-8, 15-17)",
    "Paris Est (10-12, 19-20)",
    "Paris Nord (9, 18)",
    "Paris Sud (13-14)",
    // Vous pourrez ajouter plus tard :
    // "Petite couronne (92, 93, 94)",
    // "Grande couronne (77, 78, 91, 95)",
  ];

  // Filtrer les concerts par zone
  const filteredConcerts = concerts.filter((concert) => {
    if (selectedZone === "Toutes les zones") return true;

    const postalCode = concert.venue.postalCode;

    // Paris Centre
    if (selectedZone === "Paris Centre (1 à 4)") {
        return [75001, 75002, 75003, 75004].includes(postalCode);
    }
    // Paris Ouest
    if (selectedZone === "Paris Ouest (7 à 8, 15 à 17)") {
        return [75007, 75008, 75015, 75016, 75017].includes(postalCode);
    }
    // Paris Est
    if (selectedZone === "Paris Est (10 à 12, 19 à 20)") {
        return [75010, 75011, 75012, 75019, 75020].includes(postalCode);
    }
    // Paris Nord
    if (selectedZone === "Paris Nord (9, 18)") {
        return [75009, 75018].includes(postalCode);
    }
    // Paris Sud
    if (selectedZone === "Paris Sud (13 à 14)") {
        return [75013, 75014].includes(postalCode);
    }
    return false;

  });

  const renderFilters = () => {
    return (
      <div>

        <div className="flex flex-wrap gap-2">
          {ZONES.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedZone === zone
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderFilters()}
      
      {filteredConcerts.length === 0 ? (
        <p className="mt-6 text-white">Aucun concert disponible dans cette zone.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    venuePostalCode={concert.venue.postalCode}
                    date={concert.eventDate}
                    time={concert.eventTime}
                    price={concert.price}
                    />  
            ))}
      </div>
  )};
    </div>
    );
}

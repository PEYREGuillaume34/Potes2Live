"use client";

type ConcertFiltersProps = {
  selectedCity: string;
  onCityChange: (city: string) => void;
};

const CITIES = [
  "Toutes les villes",
  "Paris",
  "Lyon",
  "Marseille",
  "Toulouse",
  "Bordeaux",
  "Lille",
];

export function ConcertFilters({ selectedCity, onCityChange }: ConcertFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Filtrer par ville</h3>
      
      <div className="flex flex-wrap gap-2">
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCity === city
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
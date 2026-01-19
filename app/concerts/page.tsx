import Link from "next/link";
import { getUpcomingConcerts, getConcertsByCity } from "../actions/concerts.action";
import { ConcertsClient } from "./ConcertsClient";

export default async function ConcertsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; postalCode?: string }>;
}) {

  const params = await searchParams;
  // Utilise les paramètres de recherche pour filtrer
   const result = params.city 
    ? await getConcertsByCity(params.city, params.postalCode)
    : await getUpcomingConcerts();

  if (!result.success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Erreur</h3>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-white text-center mb-8">
        Découvrez les prochains concerts et rejoignez des groupes de fans pour y
        assister ensemble!
      </p>
      <ConcertsClient concerts={result.data} initialCity={params.city} initialPostalCode={params.postalCode} />
    </div>
  );
}

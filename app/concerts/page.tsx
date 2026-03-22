import { getUpcomingConcerts, getConcertsByCity } from "../actions/concerts.action";
import { ConcertsClient } from "./ConcertsClient";
import { Speaker } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-20">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h3 className="font-semibold mb-2">Erreur</h3>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  const concerts = (result.data ?? []).map((concert) => ({
    ...concert,
    eventTime: concert.eventTime ?? null,
    groupCount: concert.groupCount ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-20">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Speaker className="w-8 h-8 text-orange-clair" />
          Concerts
        </h1>
      <p className="text-gray-400 mb-8">
        Découvrez les prochains concerts et rejoignez des groupes de fans !
      </p>
      <ConcertsClient concerts={concerts} initialCity={params.city} initialPostalCode={params.postalCode} />
    </div>
  );
}

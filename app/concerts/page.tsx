import Link from "next/link";
import { getUpcomingConcerts } from "../actions/concerts.action";
import { ConcertsClient } from "./ConcertsClient";

export default async function ConcertsPage() {
  const result = await getUpcomingConcerts();
  console.log("Resultat concerts:", result);

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
      <ConcertsClient concerts={result.data} />
    </div>
  );
}

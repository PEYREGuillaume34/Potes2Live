import { getUpcomingConcerts } from "@/app/actions/concerts.actions";
import { ConcertsClient } from "@/app/(protected)/concerts/ConcertsClient";
import { redirect } from "next/navigation";

export default async function ConcertsPage() {
  const result = await getUpcomingConcerts();

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

  return <ConcertsClient concerts={result.data} />;
}
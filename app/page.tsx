"use client";

import Link from "next/link";
import { useSession } from "./lib/auth-client";

export default function HomePage() {
  const { data: session, isPending } = useSession();

  return (
    <div>
      <img
        src="/logo/logoPDL.svg"
        alt="PotesdeLive Logo"
        className="mx-auto my-1 max-w-2xs"
      />
      <p className="text-lg text-center text-white mb-4">
        Trouvez des concerts et formez des groupes pour y aller ensemble.
      </p>
      <div className="flex justify-center space-x-4">
        {isPending ? (
          <div className="text-white mt-4">Chargement...</div>
        ) : session?.user ? (
          // Utilisateur connecté
          <div className="text-white mt-3 bg-orange-clair p-2 pl-6 pr-6 rounded-full">
            <p className=" text-xl font-bold text-black">
              Bienvenue, {session.user.name}!
            </p>
          </div>
        ) : (
          // Utilisateur non connecté
          /* Conteneur des boutons avec le séparateur */
          <div className="flex items-stretch bg-white rounded-full overflow-hidden">
            <Link
              className="py-3 px-6 text-black font-bold hover:bg-gray-100 transition-colors"
              href="/login"
            >
              se connecter
            </Link>

            {/* La ligne de séparation orange */}
            <div className="w-0.5 bg-orange-500 my-2"></div>

            <Link
              className="py-3 px-6 text-black font-bold hover:bg-gray-100 transition-colors"
              href="/register"
            >
              s'inscrire
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

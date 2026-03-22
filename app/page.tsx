"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "./lib/auth-client";


export default function HomePage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center px-4">
      <Image
        src="/logo/logoPDL.svg"
        alt="PotesdeLiveLogo"
        width={260}
        height={260}
        className="mx-auto mt-10 md:mt-0 mb-2"
        priority
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
              s&apos;inscrire
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

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
      <p className="text-lg text-center text-white">
        Trouvez des concerts et formez des groupes pour y aller ensemble.
      </p>
      <div className="flex justify-center space-x-4">

      {isPending ? (
        <div className="text-white mt-4">Chargement...</div>
      ) : session?.user ? (
        // Utilisateur connecté
        <div className="text-white mt-4 bg-orange-clair p-2 pl-6 pr-6 rounded-full">
          <p className=" text-xl font-bold text-black">
            Bienvenue, {session.user.name}!
          </p>
          </div>
      ) : (
        // Utilisateur non connecté
        <>
         <Link className="bg-white text-black font-bold py-2 px-4 rounded-full mt-4" href='/login'>
          se connecter
        </Link>
        <Link className="bg-white text-black font-bold py-2 px-4 rounded-full mt-4" href='/register'>
          s'inscrire
        </Link>
        </>
      )}
      </div>
    </div>
  );
}

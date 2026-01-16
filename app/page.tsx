import Link from "next/link";

export default function HomePage() {
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
        <Link className="bg-white text-gris-fonce font-bold py-2 px-4 rounded-full mt-4" href='/login'>
          se connecter
        </Link>
        <Link className="bg-white text-gris-fonce font-bold py-2 px-4 rounded-full mt-4" href='/register'>
          s'inscrire
        </Link>
      </div>
    </div>
  );
}

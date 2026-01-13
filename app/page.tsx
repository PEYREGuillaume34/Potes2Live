import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20 text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
          Potes2Live
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-light">
          Trouvez des concerts et formez des groupes
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 opacity-90 max-w-2xl mx-auto px-4">
          Ne ratez plus jamais un concert ! Trouvez des passionnés de musique près de chez vous
          et vivez l'expérience ensemble.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4">
          <Link
            href="/register"
            className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Inscription
          </Link>
          <Link
            href="/login"
            className="bg-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-purple-900 transition-colors"
          >
            Se connecter
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 text-left px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎸</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Découvrez des concerts</h3>
            <p className="opacity-90 text-sm sm:text-base">
              Explorez les événements musicaux près de chez vous
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👥</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Formez des groupes</h3>
            <p className="opacity-90 text-sm sm:text-base">
              Rencontrez des fans qui partagent votre passion
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 sm:col-span-2 md:col-span-1">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Organisez-vous</h3>
            <p className="opacity-90 text-sm sm:text-base">
              Discutez et planifiez votre sortie ensemble
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

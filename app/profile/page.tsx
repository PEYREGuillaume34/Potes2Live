import Link from "next/link";
import { CircleUserRound, Settings } from "lucide-react";
import Image from "next/image";
import { getMyPastConcerts } from "../actions/groups.actions";
import { getMyFavoriteArtists } from "../actions/user";
import type { FavoriteArtistItem, PastConcertProfileItem } from "../type";

export default async function ProfilePage() {
    const [pastConcertsResult, favoriteArtistsResult] = await Promise.all([
        getMyPastConcerts(),
        getMyFavoriteArtists(),
    ]);

    const pastConcerts = (pastConcertsResult.success
        ? (pastConcertsResult.data ?? [])
        : []) as PastConcertProfileItem[];

    const favoriteArtists = (favoriteArtistsResult.success
        ? (favoriteArtistsResult.data ?? [])
        : []) as FavoriteArtistItem[];

    return (
        <div className="flex flex-col bg-black max-w-7xl mx-auto px-4 py-8 md:py-20">
            {/* Header fixe en haut - mobile uniquement */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-black z-10 border-b border-gray-700">
                <div className="flex items-center justify-between px-4 py-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <CircleUserRound className="w-8 h-8 text-orange-clair" />
                Mon profil
              </h1>
                    <Link 
                        href="/profile-edit" 
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Paramètres"
                    >
                        <Settings className="w-6 h-6 text-white" />
                    </Link>
                </div>
            </header>

{/* Header desktop - dans le flux normal */}
<div className="hidden md:flex items-center justify-between px-4 py-10 border-b border-gray-700">
    <h1 className="flex items-center gap-3 text-2xl font-bold text-white">
    <CircleUserRound className="w-8 h-8 text-orange-clair" />
    Mon profil
    </h1>
    <Link
        href="/profile-edit"
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        aria-label="Paramètres"
    >
        <Settings className="w-6 h-6 text-white" />
    </Link>
</div>


            {/* Contenu principal avec marge pour le header */}
            <main className="grow pt-20 px-4 md:pt-10 md:px-8">
                <div className="text-white">
                    <h2 className="text-xl font-semibold mb-2">Bienvenue sur votre profil !</h2>
                    

                    <h2 className="text-xl font-semibold mb-2 mt-4">Historique de concerts</h2>

                                        {!pastConcertsResult.success ? (
                                            <p className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-4 w-full">
                                                Impossible de charger votre historique pour le moment.
                                            </p>
                                        ) : pastConcerts.length === 0 ? (
                                            <p className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4 w-full">
                                                Aucun concert passé pour le moment.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {pastConcerts.map((concert) => (
                                                    <article
                                                        key={`${concert.id}-${concert.groupId}`}
                                                        className="bg-gray-900/70 border border-gray-700 rounded-lg overflow-hidden opacity-80"
                                                    >
                                                        <div className="flex gap-4 p-4">
                                                            <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden bg-gray-800">
                                                                {concert.imageUrl ? (
                                                                    <Image
                                                                        src={concert.imageUrl}
                                                                        alt={concert.title}
                                                                        fill
                                                                        sizes="96px"
                                                                        className="object-cover grayscale"
                                                                    />
                                                                ) : null}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <h3 className="text-base font-semibold text-gray-200 truncate">
                                                                    {concert.title}
                                                                </h3>
                                                                <p className="text-sm text-gray-400 mt-1">
                                                                    {new Date(concert.eventDate).toLocaleDateString("fr-FR", {
                                                                        day: "numeric",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                    })}
                                                                    {concert.eventTime ? ` - ${concert.eventTime}` : ""}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-2">
                                                                    Groupe: {concert.groupName}
                                                                </p>
                                                                <Link
                                                                    href={`/concerts/${concert.slug}`}
                                                                    className="inline-block text-sm text-orange-clair mt-3 hover:underline"
                                                                >
                                                                    Voir la fiche concert
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        )}

                    <h2 className="text-xl font-semibold mb-2 mt-4">Mes artistes préférés</h2>

                                        {!favoriteArtistsResult.success ? (
                                            <p className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-4 w-full">
                                                Impossible de charger vos artistes favoris.
                                            </p>
                                        ) : favoriteArtists.length === 0 ? (
                                            <p className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4 w-full">
                                                Vous n&apos;avez pas encore d&apos;artistes favoris.
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {favoriteArtists.map((artist) => (
                                                    <article
                                                        key={artist.id}
                                                        className="bg-gray-900 border border-gray-700 rounded-lg p-3"
                                                    >
                                                        <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-800">
                                                            {artist.imageUrl ? (
                                                                <Image
                                                                    src={artist.imageUrl}
                                                                    alt={artist.name}
                                                                    fill
                                                                    sizes="(max-width: 768px) 40vw, 20vw"
                                                                    className="object-cover"
                                                                />
                                                            ) : null}
                                                        </div>
                                                        <h3 className="font-semibold text-sm mt-3 truncate">{artist.name}</h3>
                                                        <p className="text-xs text-gray-400 truncate">{artist.genre || "Genre non précisé"}</p>
                                                    </article>
                                                ))}
                                            </div>
                                        )}
                </div>
            </main>
        </div>
    );
}
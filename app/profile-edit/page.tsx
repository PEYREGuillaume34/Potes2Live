"use client";

import { Check, ChevronLeft, Power, UserRoundPen, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "../lib/auth-client";
import {
  addFavoriteArtist,
  getArtistsCatalog,
  getMyFavoriteArtists,
  removeFavoriteArtist,
  updateUserProfile,
} from "../actions/user";
import Image from "next/image";
import type { FavoriteArtistItem } from "../type";

interface ExtendedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  avatar_url?: string | null;
  name: string;
  bio?: string | null;
}

export default function EditProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // États pour les champs modifiables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [artistsCatalog, setArtistsCatalog] = useState<FavoriteArtistItem[]>([]);
  const [favoriteArtistIds, setFavoriteArtistIds] = useState<Set<number>>(new Set());
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<number | null>(null);

  // Synchroniser avec la session
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || "");
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [user]);

  useEffect(() => {
    const loadFavoriteData = async () => {
      if (!user) {
        setArtistsCatalog([]);
        setFavoriteArtistIds(new Set());
        return;
      }

      setIsFavoritesLoading(true);
      setFavoriteError(null);

      try {
        const [catalogResult, favoritesResult] = await Promise.all([
          getArtistsCatalog(),
          getMyFavoriteArtists(),
        ]);

        if (!catalogResult.success) {
          throw new Error("Erreur chargement catalogue artistes");
        }

        if (!favoritesResult.success) {
          throw new Error("Erreur chargement favoris");
        }

        const favorites = favoritesResult.data || [];
        setArtistsCatalog((catalogResult.data || []) as FavoriteArtistItem[]);
        setFavoriteArtistIds(new Set(favorites.map((artist) => artist.id)));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setFavoriteError(err.message);
        } else {
          setFavoriteError("Impossible de charger les artistes favoris");
        }
      } finally {
        setIsFavoritesLoading(false);
      }
    };

    loadFavoriteData();
  }, [user]);

  const handleToggleFavorite = async (artistId: number) => {
    if (!user) return;

    setUpdatingFavoriteId(artistId);
    setFavoriteError(null);

    try {
      const isFavorite = favoriteArtistIds.has(artistId);
      const result = isFavorite
        ? await removeFavoriteArtist(artistId)
        : await addFavoriteArtist(artistId);

      if (!result.success) {
        throw new Error(result.error || "Impossible de mettre à jour les favoris");
      }

      setFavoriteArtistIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) {
          next.delete(artistId);
        } else {
          next.add(artistId);
        }
        return next;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFavoriteError(err.message);
      } else {
        setFavoriteError("Erreur lors de la mise à jour des favoris");
      }
    } finally {
      setUpdatingFavoriteId(null);
    }
  };

  // Fonction de sauvegarde
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("bio", bio);
      formData.append("avatar_url", avatarUrl);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      await updateUserProfile(formData);

      setSuccess(true);
      setIsEditing(false);
      
      // Rafraîchir après 1 seconde pour montrer le message de succès
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la sauvegarde");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'annulation
  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setBio(user?.bio || "");
    setAvatarUrl(user?.avatar_url || "");
    setCurrentPassword("");
    setNewPassword("");
    setError(null);
    setIsEditing(false);
  };

  // Fonction de déconnexion
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 bg-black z-10 border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/profile"
            className="p-2 hover:bg-black rounded-full transition-colors"
            aria-label="Retour au profil"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Profil</h1>
          <div className="w-10" /> {/* Spacer pour centrer le titre */}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="grow pt-20 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Messages d'erreur et succès */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!user && (
            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-lg mb-4">
              Vous devez être connecté pour éditer votre profil.
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-4">
              Profil mis à jour avec succès !
            </div>
          )}

          {/* Photo de profil */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-3">
              {(isEditing ? avatarUrl : user?.avatar_url) ? (
                <Image 
                  src={(isEditing ? avatarUrl : user?.avatar_url)!} 
                  alt="Photo de profil" 
                  className="w-full h-full rounded-full object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <span className="text-4xl text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>

          {!isEditing ? (
            // ========== MODE LECTURE ==========
            <div className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nom complet
                </label>
                <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  {user?.name || "Non disponible"}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Adresse e-mail
                </label>
                <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  {user?.email || "Non disponible"}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  {user?.bio || "Pas encore de bio"}
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Mot de passe
                </label>
                <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  ********
                </div>
              </div>
            </div>
          ) : (
            // ========== MODE ÉDITION ==========
            <div className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4 w-full"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4 w-full"
                  placeholder="Votre adresse e-mail"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4 w-full"
                  placeholder="Une petite bio sur vous"
                  rows={3}
                />
              </div>

              {/* URL de l'avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  URL de la photo de profil
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4 w-full"
                  placeholder="https://exemple.com/photo.jpg"
                />
              </div>

              {/* Changement de mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4 w-full"
                  placeholder="Votre mot de passe actuel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4 w-full"
                  placeholder="Votre nouveau mot de passe"
                />
              </div>
            </div>
          )}

          {/* Actions - Affichées uniquement si l'utilisateur est connecté */}
          {user && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer disabled:cursor-not-allowed bg-orange-fonce text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2 hover:bg-orange-900"
                >
                  <UserRoundPen />
                  Éditer le profil
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="cursor-pointer disabled:cursor-not-allowed bg-green-500 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2 hover:bg-green-600 disabled:opacity-50"
                  >
                    <Check />
                    {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="cursor-pointer disabled:cursor-not-allowed bg-gray-700 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2 hover:bg-gray-600 disabled:opacity-50"
                  >
                    <X />
                    Annuler
                  </button>
                </div>
              )}

              {/* Déconnexion */}
              <button
                onClick={handleSignOut}
                className="cursor-pointer disabled:cursor-not-allowed sm:mt-0 bg-red-500 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-50"
              >
                <Power />
                Déconnexion
              </button>
            </div>
          )}

          {user && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-3">Tes artistes favoris</h2>

              {favoriteError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                  {favoriteError}
                </div>
              )}

              {isFavoritesLoading ? (
                <p className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  Chargement des artistes...
                </p>
              ) : artistsCatalog.length === 0 ? (
                <p className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  Aucun artiste disponible pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {artistsCatalog.map((artist) => {
                    const isFavorite = favoriteArtistIds.has(artist.id);
                    const isUpdating = updatingFavoriteId === artist.id;

                    return (
                      <article
                        key={artist.id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-3"
                      >
                        <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-700 shrink-0">
                          {artist.imageUrl ? (
                            <Image
                              src={artist.imageUrl}
                              alt={artist.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{artist.name}</p>
                          <p className="text-sm text-gray-400 truncate">
                            {artist.genre || "Genre non précisé"}
                          </p>
                        </div>

                        <button
                          onClick={() => handleToggleFavorite(artist.id)}
                          disabled={isUpdating}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
                            isFavorite
                              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                              : "bg-orange-fonce text-white hover:bg-orange-900"
                          }`}
                        >
                          {isUpdating ? "..." : isFavorite ? "Retirer" : "Ajouter"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          
        </div>
      </main>
    </div>
  );
}

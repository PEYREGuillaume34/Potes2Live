"use client";

import { Check, ChevronLeft, Power, UserRoundPen, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "../lib/auth-client";
import { updateUserProfile } from "../actions/user";


export default function EditProfilePage() {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // États pour les champs modifiables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Synchroniser avec la session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setBio(session.user.bio || "");
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [session]);

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
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      await updateUserProfile(formData);

      setSuccess(true);
      setIsEditing(false);
      
      // Rafraîchir après 1 seconde pour montrer le message de succès
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'annulation
  const handleCancel = () => {
    setName(session?.user?.name || "");
    setEmail(session?.user?.email || "");
    setBio(session?.user?.bio || "");
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
      <main className="flex-grow pt-20 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Messages d'erreur et succès */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
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
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Photo de profil" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            {isEditing && (
              <button className="text-orange-fonce text-sm font-medium">
                Changer la photo
              </button>
            )}
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
                  {session?.user?.name}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Adresse e-mail
                </label>
                <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  {session?.user?.email}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg p-4">
                  {session?.user?.bio || "Pas encore de bio"}
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-fonce text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2"
              >
               <UserRoundPen />
                Éditer le profil
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-500 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Check />
                  ) : (
                    <Check />
                  )}
                  {isLoading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-700 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2"
                >
                   <X />
                  Annuler
                </button>
              </div>
            )}

            {/* Déconnexion */}
            <button
              onClick={handleSignOut}
              className="sm:mt-0 bg-red-500 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center gap-2"
            >
              <Power />
              Déconnexion
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

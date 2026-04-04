"use server";

import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db/drizzle";
import { artists, favoriteArtists, user } from "@/app/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";





// Mettre à jour le profil utilisateur
export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non authentifié");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  const avatar_url = (formData.get("avatar_url") as string) || null;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  // Si on veut changer le mot de passe
  if (newPassword && newPassword.trim() !== "") {
    if (!currentPassword) {
      throw new Error("Le mot de passe actuel est requis");
    }

    try {
      // ✅ Utiliser l'API Better-Auth pour changer le mot de passe
      // Better-Auth vérifie automatiquement l'ancien mot de passe
      await auth.api.changePassword({
        body: {
          newPassword: newPassword,
          currentPassword: currentPassword,
        },
        headers: await headers(),
      });
    } catch (error: unknown) {
      // Better-Auth retourne une erreur si le mot de passe actuel est incorrect
      console.error("Erreur changement mot de passe:", error);
      throw new Error("Mot de passe actuel incorrect");
    }
  }

  // Mise à jour du nom, email, bio et avatar
  await db
    .update(user)
    .set({
      name,
      email,
      bio,
      avatar_url,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/profile");
  revalidatePath("/profile-edit");
  return { success: true };
}

// ========================================
// ARTISTES FAVORIS DE L'UTILISATEUR
// ========================================
export async function getMyFavoriteArtists() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Non authentifié" };
  }

  const favorites = await db
    .select({
      id: artists.id,
      name: artists.name,
      genre: artists.genre,
      imageUrl: artists.imageUrl,
      spotifyUrl: artists.spotifyUrl,
      instagramUrl: artists.instagramUrl,
      bio: artists.bio,
    })
    .from(favoriteArtists)
    .innerJoin(artists, eq(favoriteArtists.artistId, artists.id))
    .where(eq(favoriteArtists.userId, session.user.id))
    .orderBy(asc(artists.name));

  return { success: true, data: favorites };
}

export async function addFavoriteArtist(artistId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Non authentifié" };
  }

  await db.insert(favoriteArtists).values({
    userId: session.user.id,
    artistId,
  })
  .onConflictDoNothing({
    target: [favoriteArtists.userId, favoriteArtists.artistId],
  });
  revalidatePath("/profile");
  revalidatePath("/profile-edit");
  return { success: true, message: "Artiste ajouté aux favoris" };
}

export async function removeFavoriteArtist(artistId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Non authentifié" };
  }

  await db
    .delete(favoriteArtists)
    .where(
      and(
      eq(favoriteArtists.userId, session.user.id),
      eq(favoriteArtists.artistId, artistId),
      )
    );

  revalidatePath("/profile");
  revalidatePath("/profile-edit");
  return { success: true, message: "Artiste retiré des favoris" };
}

export async function getArtistsCatalog() {
  const artistsCatalog = await db
    .select({
      id: artists.id,
      name: artists.name,
      genre: artists.genre,
      imageUrl: artists.imageUrl,
      spotifyUrl: artists.spotifyUrl,
      instagramUrl: artists.instagramUrl,
      bio: artists.bio,
    })
    .from(artists)
    .orderBy(asc(artists.name));

  return { success: true, data: artistsCatalog };
}

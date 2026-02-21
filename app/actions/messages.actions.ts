"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { db } from "../lib/db/drizzle";
import { groupMembers, groupMessages, user } from "../lib/db/schema";
import { eq, and } from "drizzle-orm/sql/expressions/conditions";

export async function getGroupMessages(groupId: number) {
try{
    // 1. Récupérer la session utilisateur
    const session = await auth.api.getSession({
    headers: await headers(),
});

    if (!session){
        return { success: false, error: "Utilisateur non authentifié" };
    }

    // 2. Vérifier que l'utilisateur est membre du groupe
    const [isMemberResult] = await db
    .select()
    .from(groupMembers)
    .where(
        and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, session.user.id),
            eq(groupMembers.status, "active")
        )
    )
    .limit(1);

    if (!isMemberResult){
        return { success: false, error: "Accès refusé : vous n'êtes pas membre de ce groupe." };
    }

    // 3. Récupérer les messages du groupe
    const messages = await db
    .select({
        id: groupMessages.id,
        content: groupMessages.content,
        createdAt: groupMessages.createdAt,
        user: {
            id: user.id,
            name: user.name,
            avatar_url: user.avatar_url,
        },
    })
    .from(groupMessages)
    .innerJoin(user, eq(groupMessages.userId, user.id))
    .where(eq(groupMessages.groupId, groupId))
    .orderBy(groupMessages.createdAt);

    // 4. Retourner les messages
    return { success: true, data: messages };
} catch (error) {
    console.error("Erreur lors de la récupération des messages du groupe :", error);
    return { success: false, error: "Erreur serveur lors de la récupération des messages." };
}
}

export async function sendGroupMessage(groupId: number, content: string) {
    try {
        // 1. Récupérer la session utilisateur
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: "Utilisateur non authentifié" };
        }

        // 2. Vérifier que l'utilisateur est membre du groupe
        const [isMemberResult] = await db
            .select()
            .from(groupMembers)
            .where(
                and(
                    eq(groupMembers.groupId, groupId),
                    eq(groupMembers.userId, session.user.id),
                    eq(groupMembers.status, "active")
                )
            )
            .limit(1);

            if (!isMemberResult) {
                return { success: false, error: "Accès refusé : vous n'êtes pas membre de ce groupe." };
            }

            // Valider le contenu du message
            if (content.trim().length === 0) {
                return { success: false, error: "Le contenu du message ne peut pas être vide." };
            }

            // 3. Insérer le message dans la base de données
            await db
                .insert(groupMessages)
                .values({
                    groupId: groupId,
                    userId: session?.user.id,
                    content:content.trim(),
                });

            // 4. Retourner le succès
            return { success: true, message: "Message envoyé avec succès." };
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        return { success: false, error: "Erreur serveur lors de l'envoi du message." };
    }
}
import { is, max } from "drizzle-orm";
import { db } from "../lib/db/drizzle";
import { groups, groupMembers, user } from "@/app/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";


// Récupérer les groupes associés à un événement avec le nombre de membres actifs
export async function getGroupsByEvent(eventId: number) {
    try {
        const groupswithMembers = await db
        .select({
            id: groups.id,
            name: groups.name,
            description: groups.description,
            maxMembers: groups.maxMembers,
            createdAt: groups.createdAt,
            ownerId: {
                id: user.id,
                name: user.name,
                image: user.image,
            },
            memberCount: count(groupMembers.id),
        })
        .from(groups)
        .innerJoin(user, eq(groups.ownerId, user.id))
        .leftJoin(groupMembers, and(
            eq(groups.id, groupMembers.groupId),
            eq(groupMembers.status, "active")
        ))
        .where(and(
            eq(groups.eventId, eventId),
            eq(groups.isActive, true)
        ))
        .groupBy(groups.id, user.id);

        return { success: true, data: groupswithMembers };
    } catch (error) {
        console.error("Erreur récupération groupes:", error);
        return { success: false, error: "Erreur lors de la récupération des groupes" };
        }
}

export async function createGroup(eventId: number, name :string, description: string, maxMembers: number = 10) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { success: false, error: "Non authentifié" };
        }

        const [newGroup] = await db
        .insert(groups)
        .values({
            eventId,
            ownerId: session.user.id,
            name,
            description,
            maxMembers,
            isActive: true,
            createdAt: new Date(),
        })
        .returning();

        // Ajouter le créateur en tant que membre actif du groupe
        await db
        .insert(groupMembers).values({
            groupId: newGroup.id,
            userId: session.user.id,
            role: "owner",
            status: "active",
        })

        return { success: true, data: newGroup };
    } catch (error) {
        console.error("Erreur création groupe:", error);
        return { success: false, error: "Erreur lors de la création du groupe" };
    }
}

export async function joinGroup(groupId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { success: false, error: "Non authentifié" };
        }

        // Vérifier si l'utilisateur est déjà membre du groupe
        const existingMember = await db
        .select()
        .from(groupMembers)
        .where(and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, session.user.id)
        ))
        .limit(1);

        if (existingMember.length > 0) {
            return { success: false, error: "Vous êtes déjà membre de ce groupe" };
        }

        // Verifier si le groupe est déja plein
        const memberCount = await db
        .select({ count : count()})
        .from(groupMembers)
        .where(and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.status, "active")
        ));

        const [group] = await db
        .select()
        .from(groups)
        .where(eq(groups.id, groupId))
        .limit(1);

        if (memberCount[0].count >= group.maxMembers) {
            return { success: false, error: "Le groupe est complet" };
        }

        // Rejoindre le groupe
        await db
        .insert(groupMembers).values({
            groupId: groupId,
            userId: session.user.id,
            role: "member",
            status: "active",
        })

        return { success: true, message: "Vous avez rejoint le groupe" };
    } catch (error) {
        console.error("Erreur rejoindre groupe:", error);
        return { success: false, error: "Erreur lors de la tentative de rejoindre le groupe" };
}
}

export async function leaveGroup(groupId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if (!session) {
            return { success: false, error: "Non authentifié" };
        }

        // Mettre à jour le statut du membre à "inactive"
        await db
        .update(groupMembers)
        .set({ status: "inactive" })
        .where(and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, session.user.id)
        ));

        return { success: true, message: "Vous avez quitté le groupe" };
    } catch (error) {
        console.error("Erreur quitter groupe:", error);
        return { success: false, error: "Erreur lors de la tentative de quitter le groupe" };
    }
}

export async function getGroupById(groupId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Non authentifié" };
        }

        const [group] = await db
        .select({
            id: groups.id,
            name: groups.name,
            description: groups.description,
            maxMembers: groups.maxMembers,
            isActive: groups.isActive,
            createdAt: groups.createdAt,
            eventId: groups.eventId,
            ownerId: {
                id: user.id,
                name: user.name,
                image: user.image,
            },
        })
        .from(groups)
        .innerJoin(user, eq(groups.ownerId, user.id))
        .where(eq(groups.id, groupId))
        .limit(1);

        if (!group) {
            return { success: false, error: "Groupe non trouvé" };
        }

        return { success: true, data: group };
    } catch (error) {
        console.error("Erreur récupération groupe par ID:", error);
        return { success: false, error: "Erreur lors de la récupération du groupe" };
    }
}

export async function getGroupMembers(groupId: number) {
    try {
        const members = await db
        .select({
            id: groupMembers.id,
            role: groupMembers.role,
            status: groupMembers.status,
            joinedAt: groupMembers.joinedAt,
            user: {
                id: user.id,
                name: user.name,
                image: user.image,
            },
        })
        .from(groupMembers)
        .innerJoin(user, eq(groupMembers.userId, user.id))
        .where(and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.status, "active")
        ))
        .orderBy(groupMembers.joinedAt);

        return { success: true, data: members };
    } catch (error) {
        console.error("Erreur récupération membres du groupe:", error);
        return { success: false, error: "Erreur lors de la récupération des membres du groupe" };
    }
       
}

export async function isUserMemberOfGroup(groupId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Non authentifié" };
        }

        const [member] = await db
        .select()
        .from(groupMembers)
        .where(and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, session.user.id),
            eq(groupMembers.status, "active")
        ))
        .limit(1);

        return { success: true, isMember: !!member, role: member?.role };
    } catch (error) {
        console.error("Erreur vérification membre du groupe:", error);
        return { success: false, error: "Erreur lors de la vérification du membre du groupe" };
    }
}

export async function desactivateGroup(groupId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Non authentifié" };
        }

        // Vérifier si l'utilisateur est le propriétaire du groupe
        const [group] = await db
        .select()
        .from(groups)
        .where(eq(groups.id, groupId))
        .limit(1);

        if (group.ownerId !== session.user.id) {
            return { success: false, error: "Vous n'êtes pas le propriétaire du groupe" };
        }

        // Désactiver le groupe
        await db
        .update(groups)
        .set({ isActive: false })
        .where(eq(groups.id, groupId));
    
        return { success: true, message: "Le groupe a été désactivé" };
    } catch (error) {
        console.error("Erreur désactivation groupe:", error);
        return { success: false, error: "Erreur lors de la désactivation du groupe" };
    }
}

"use server";


import { db } from "../lib/db/drizzle";
import { artists, events, venues } from "../lib/db/schema";
import { eq, desc } from "drizzle-orm";



export async function getUpcomingConcerts() {
    try {
        const concerts = await db
        .select({
            id: events.id,
            slug: events.slug,
            title:events.title,
            description: events.description,
            imageUrl: events.imageUrl,
            eventDate: events.eventDate,
            eventTime: events.eventTime,
            price: events.price,
            ticketUrl: events.ticketUrl,
            artist: {
                id: artists.id,
                name: artists.name,
                genre : artists.genre,
                imageUrl: artists.imageUrl,
            },
            venue: {
                id:venues.id,
                name: venues.name,
                city: venues.city,
                postalCode: venues.postalCode,
                address: venues.address, 
            },  
        })
        .from(events)
        .innerJoin(artists, eq(events.artistId, artists.id))
        .innerJoin(venues, eq(events.venueId, venues.id))
        .where(eq(events.status, "upcoming"))
        .orderBy(desc(events.eventDate));

        return { success: true, data: concerts };
    } catch (error) {
        console.error("Erreur récupération concerts:", error);
        return { success: false, error: "Erreur lors de la récupération des concerts" };
    }
}
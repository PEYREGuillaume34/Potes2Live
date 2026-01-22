"use server";


import { db } from "../lib/db/drizzle";
import { artists, events, venues } from "../lib/db/schema";
import { eq, desc, and } from "drizzle-orm";



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

export async function getConcertsByCity(city: string, postalCode?: string) {
    try {
        
        const conditions = [eq(events.status, "upcoming")];

        if (postalCode) {
             // Filtre par code postal exact (ex: 75001)
            conditions.push(eq(venues.postalCode, postalCode));
        } else if (city === "Paris") {
            // Filtre Paris + tous ses arrondissements (75001-75020)
            conditions.push(eq(venues.city, "Paris"));
        } else {
            // Autre ville
            conditions.push(eq(venues.city, city));
        }
        
        const concerts = await db
        .select({
        id: events.id,
        slug: events.slug,
        title: events.title,
        imageUrl: events.imageUrl,
        eventDate: events.eventDate,
        price: events.price,
        artist: {
            name: artists.name,
            genre : artists.genre,
            imageUrl: artists.imageUrl,
        },
        venue: {
            name: venues.name,
            city: venues.city,
            postalCode: venues.postalCode,
        },
        })
        .from(events)
        .innerJoin(artists, eq(events.artistId, artists.id))
        .innerJoin(venues, eq(events.venueId, venues.id))
        .where(and(...conditions))
        .orderBy(desc(events.eventDate));

        return { success: true, data: concerts };
    } catch (error) {
        console.error("Erreur récupération concerts par ville:", error);
        return { success: false, error: "Erreur lors de la récupération des concerts par ville" };
    }
    }

    export async function getConcertBySlug(slug: string) {
        try {
            const concert = await db
            .select({
                id: events.id,
                slug: events.slug,
                title: events.title,
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
                    spotifyUrl: artists.spotifyUrl,
                    instagramUrl: artists.instagramUrl,
                    bio: artists.bio,
                },
                venue: {
                    id:venues.id,
                    name: venues.name,
                    city: venues.city,
                    postalCode: venues.postalCode,
                    address: venues.address,
                    latitude: venues.latitude,
                    longitude: venues.longitude,
                },
            })
            .from(events)
            .innerJoin(artists, eq(events.artistId, artists.id))
            .innerJoin(venues, eq(events.venueId, venues.id))
            .where(eq(events.slug, slug))
            .limit(1);

            if (concert.length === 0) {
                return { success: false, error: "Concert non trouvé" };
            }
            return { success: true, data: concert[0] };
        } catch (error) {
            console.error("Erreur récupération concert par slug:", error);
            return { success: false, error: "Erreur lors de la récupération du concert" };
        }
    }
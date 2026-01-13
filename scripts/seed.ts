import "dotenv/config"; 
import { db } from "../app/lib/db/drizzle";
import { artists, venues, events, user } from "../app/lib/db/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // NETTOYER LES DONNÉES EXISTANTES
    console.log("🗑️  Cleaning existing data...");
    await db.delete(events);
    await db.delete(venues);
    await db.delete(artists);
    console.log("✅ Old data cleaned");

    // 1. Créer des artistes underground
    console.log("📝 Creating artists...");
    const [videoclub, lescop, yelle, holyTwo, therapie, clara, fishbach, pendentif, superpoze, alex] = await db
      .insert(artists)
      .values([
        {
          name: "Videoclub",
          genre: "Pop électro",
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
          spotifyUrl: "https://open.spotify.com/artist/5JZ7CnR6gTvEMKX4g70Amv",
          instagramUrl: "https://instagram.com/videoclubmusic",
          bio: "Duo pop électro français aux mélodies rêveuses et nostalgiques.",
        },
        {
          name: "Lescop",
          genre: "New Wave",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
          spotifyUrl: "https://open.spotify.com/artist/3JsMj0DEzyWc0VDlHuy9Bx",
          instagramUrl: "https://instagram.com/lescopmusic",
          bio: "Artiste new wave français au style sombre et cinématographique.",
        },
        {
          name: "Yelle",
          genre: "Électro-pop",
          imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
          spotifyUrl: "https://open.spotify.com/artist/5FqTuN42w2zGw4Pzd5TTfF",
          instagramUrl: "https://instagram.com/yelle",
          bio: "Chanteuse électro-pop française culte de la scène alternative.",
        },
        {
          name: "The Holy Two",
          genre: "Indie Rock",
          imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
          spotifyUrl: "https://open.spotify.com/artist/1234",
          instagramUrl: "https://instagram.com/theholytwo",
          bio: "Groupe de rock indépendant au son brut et authentique.",
        },
        {
          name: "Therapie TAXI",
          genre: "Rock alternatif",
          imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
          spotifyUrl: "https://open.spotify.com/artist/2nKGmC5Mc13ct02xAY8ccS",
          instagramUrl: "https://instagram.com/therapie_taxi",
          bio: "Groupe rock français déjanté et énergique.",
        },
        {
          name: "Clara Luciani",
          genre: "Pop française",
          imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
          spotifyUrl: "https://open.spotify.com/artist/6w0Z0zYmAKRA1n3gFB7TkP",
          instagramUrl: "https://instagram.com/claraluciani",
          bio: "Chanteuse française à la voix puissante et aux textes poétiques.",
        },
        {
          name: "Fishbach",
          genre: "Électro sombre",
          imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
          spotifyUrl: "https://open.spotify.com/artist/4sBKfgsqHHzYCvFWvJqe9J",
          instagramUrl: "https://instagram.com/fishbach",
          bio: "Artiste électro française au style hypnotique et ténébreux.",
        },
        {
          name: "Pendentif",
          genre: "Indie Pop",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
          spotifyUrl: "https://open.spotify.com/artist/5678",
          instagramUrl: "https://instagram.com/pendentifmusic",
          bio: "Groupe indie pop aux sonorités lo-fi et intimistes.",
        },
        {
          name: "Superpoze",
          genre: "Électro/Hip-Hop",
          imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
          spotifyUrl: "https://open.spotify.com/artist/4Z7qKvjGmqWzJh0Y3XmXWL",
          instagramUrl: "https://instagram.com/superpoze",
          bio: "Beatmaker et producteur aux influences électro et hip-hop.",
        },
        {
          name: "Alex Metric",
          genre: "House/Électro",
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
          spotifyUrl: "https://open.spotify.com/artist/3cjEqqelV9zb4BYE3qDQ4O",
          instagramUrl: "https://instagram.com/alexmetric",
          bio: "DJ et producteur britannique de house et électro underground.",
        },
      ])
      .returning();

    console.log(`✅ ${videoclub.name}, ${lescop.name}, ${yelle.name}, ${holyTwo.name}, ${therapie.name} et 5 autres artistes créés`);

    // 2. Créer des salles
    console.log("📝 Creating venues...");
    const [
      // Paris - Petites salles underground
      pointEphemere, maroquinerie, fleeche, trabendo, glazart,
      // Lyon
      ninkasi, periscope, marche,
      // Marseille
      molotov, poste, boiteAJoujoux,
      // Bordeaux
      iboat, heretic, roksolidSound,
      // Toulouse
      connexion, rex, metronum,
      // Nantes
      pannonica, lieu, warehouse
    ] = await db
      .insert(venues)
      .values([
        // Paris
        {
          name: "Le Point Ephémère",
          address: "200 Quai de Valmy",
          city: "Paris",
          postalCode: "75010",
          latitude: 48.875556,
          longitude: 2.367778,
          capacity: 300,
        },
        {
          name: "La Maroquinerie",
          address: "23 Rue Boyer",
          city: "Paris",
          postalCode: "75020",
          latitude: 48.872222,
          longitude: 2.389167,
          capacity: 600,
        },
        {
          name: "La Flèche d'Or",
          address: "102 bis Rue de Bagnolet",
          city: "Paris",
          postalCode: "75020",
          latitude: 48.856389,
          longitude: 2.404444,
          capacity: 450,
        },
        {
          name: "Le Trabendo",
          address: "211 Avenue Jean Jaurès",
          city: "Paris",
          postalCode: "75019",
          latitude: 48.894167,
          longitude: 2.393333,
          capacity: 700,
        },
        {
          name: "Glazart",
          address: "7-15 Avenue de la Porte de la Villette",
          city: "Paris",
          postalCode: "75019",
          latitude: 48.896944,
          longitude: 2.387778,
          capacity: 800,
        },
        // Lyon
        {
          name: "Ninkasi Kao",
          address: "267 Rue Marcel Mérieux",
          city: "Lyon",
          postalCode: "69007",
          latitude: 45.735278,
          longitude: 4.827222,
          capacity: 900,
        },
        {
          name: "Le Périscope",
          address: "11 Rue Terme",
          city: "Lyon",
          postalCode: "69001",
          latitude: 45.769444,
          longitude: 4.831111,
          capacity: 400,
        },
        {
          name: "Le Marché Gare",
          address: "17 Rue Domer",
          city: "Lyon",
          postalCode: "69007",
          latitude: 45.743333,
          longitude: 4.836944,
          capacity: 350,
        },
        // Marseille
        {
          name: "Le Molotov",
          address: "3 Place Paul Cézanne",
          city: "Marseille",
          postalCode: "13006",
          latitude: 43.292222,
          longitude: 5.383056,
          capacity: 500,
        },
        {
          name: "La Poste à Galène",
          address: "103 Rue Ferrari",
          city: "Marseille",
          postalCode: "13005",
          latitude: 43.294722,
          longitude: 5.393889,
          capacity: 350,
        },
        {
          name: "La Boîte à Joujoux",
          address: "21 Rue Barsotti",
          city: "Marseille",
          postalCode: "13003",
          latitude: 43.311667,
          longitude: 5.381944,
          capacity: 250,
        },
        // Bordeaux
        {
          name: "I.Boat",
          address: "Quai Armand Lalande",
          city: "Bordeaux",
          postalCode: "33100",
          latitude: 44.856111,
          longitude: -0.550556,
          capacity: 800,
        },
        {
          name: "Heretic Club",
          address: "4 Quai de Paludate",
          city: "Bordeaux",
          postalCode: "33800",
          latitude: 44.833056,
          longitude: -0.563889,
          capacity: 600,
        },
        {
          name: "Rok Solid Sound",
          address: "55 Cours de l'Yser",
          city: "Bordeaux",
          postalCode: "33800",
          latitude: 44.831667,
          longitude: -0.560556,
          capacity: 400,
        },
        // Toulouse
        {
          name: "Connexion Live",
          address: "8 Rue Gabriel Péri",
          city: "Toulouse",
          postalCode: "31000",
          latitude: 43.606111,
          longitude: 1.450556,
          capacity: 500,
        },
        {
          name: "Le Rex de Toulouse",
          address: "5 Grand Rue Saint-Michel",
          city: "Toulouse",
          postalCode: "31400",
          latitude: 43.598889,
          longitude: 1.439444,
          capacity: 450,
        },
        {
          name: "Le Metronum",
          address: "2 Rond-point Madame de Mondonville",
          city: "Toulouse",
          postalCode: "31200",
          latitude: 43.633333,
          longitude: 1.441667,
          capacity: 1200,
        },
        // Nantes
        {
          name: "Le Pannonica",
          address: "9 Rue Basse Porte",
          city: "Nantes",
          postalCode: "44000",
          latitude: 47.218333,
          longitude: -1.548056,
          capacity: 450,
        },
        {
          name: "Le Lieu Unique",
          address: "2 Rue de la Biscuiterie",
          city: "Nantes",
          postalCode: "44000",
          latitude: 47.215556,
          longitude: -1.556389,
          capacity: 850,
        },
        {
          name: "Warehouse",
          address: "4 Quai des Antilles",
          city: "Nantes",
          postalCode: "44200",
          latitude: 47.201667,
          longitude: -1.572222,
          capacity: 700,
        },
      ])
      .returning();

    console.log(`✅ 19 salles underground créées dans 6 villes`);

    // 3. Créer des événements
    console.log("📝 Creating events...");
    const createdEvents = await db.insert(events).values([
      // Paris
      {
        slug: "videoclub-point-ephemere-2026",
        title: "Videoclub - En Nuit Tour",
        description: "Videoclub revient au Point Ephémère pour une soirée intime et électrisante.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        artistId: videoclub.id,
        venueId: pointEphemere.id,
        eventDate: new Date("2026-02-15"),
        eventTime: "20:30",
        price: 18.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "lescop-maroquinerie-2026",
        title: "Lescop - Nuit Sombre",
        description: "Concert new wave envoûtant de Lescop à la Maroquinerie.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        artistId: lescop.id,
        venueId: maroquinerie.id,
        eventDate: new Date("2026-03-10"),
        eventTime: "21:00",
        price: 22.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      {
        slug: "yelle-trabendo-2026",
        title: "Yelle - L'Ère du Verseau Live",
        description: "Show électro-pop explosif de Yelle au Trabendo.",
        imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
        artistId: yelle.id,
        venueId: trabendo.id,
        eventDate: new Date("2026-04-18"),
        eventTime: "20:00",
        price: 25.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "therapie-taxi-glazart-2026",
        title: "Therapie TAXI - Hit Sale Tour",
        description: "Concert rock déjanté de Therapie TAXI au Glazart.",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        artistId: therapie.id,
        venueId: glazart.id,
        eventDate: new Date("2026-05-12"),
        eventTime: "20:30",
        price: 20.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      {
        slug: "fishbach-fleche-or-2026",
        title: "Fishbach - A posteriori Live",
        description: "Performance hypnotique de Fishbach à la Flèche d'Or.",
        imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        artistId: fishbach.id,
        venueId: fleeche.id,
        eventDate: new Date("2026-03-28"),
        eventTime: "21:00",
        price: 19.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "superpoze-point-ephemere-2026",
        title: "Superpoze - Electronic Night",
        description: "Session électro intimiste de Superpoze au Point Ephémère.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        artistId: superpoze.id,
        venueId: pointEphemere.id,
        eventDate: new Date("2026-06-20"),
        eventTime: "22:00",
        price: 15.0,
        ticketUrl: "https://www.resident-advisor.net",
        status: "upcoming",
      },
      // Lyon
      {
        slug: "clara-luciani-ninkasi-lyon-2026",
        title: "Clara Luciani - Cœur Tour",
        description: "Clara Luciani en concert au Ninkasi Kao.",
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
        artistId: clara.id,
        venueId: ninkasi.id,
        eventDate: new Date("2026-04-22"),
        eventTime: "20:00",
        price: 24.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "videoclub-periscope-lyon-2026",
        title: "Videoclub - Lyon Session",
        description: "Concert intimiste de Videoclub au Périscope.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        artistId: videoclub.id,
        venueId: periscope.id,
        eventDate: new Date("2026-02-20"),
        eventTime: "20:30",
        price: 17.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      {
        slug: "holyTwo-marche-gare-lyon-2026",
        title: "The Holy Two - Indie Rock Night",
        description: "Concert rock indépendant au Marché Gare.",
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
        artistId: holyTwo.id,
        venueId: marche.id,
        eventDate: new Date("2026-05-08"),
        eventTime: "21:00",
        price: 16.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "therapie-taxi-ninkasi-lyon-2026",
        title: "Therapie TAXI - Lyon Live",
        description: "Therapie TAXI enflamme le Ninkasi.",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        artistId: therapie.id,
        venueId: ninkasi.id,
        eventDate: new Date("2026-05-16"),
        eventTime: "20:30",
        price: 22.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      // Marseille
      {
        slug: "lescop-molotov-marseille-2026",
        title: "Lescop - Nuit Méditerranéenne",
        description: "Concert new wave de Lescop au Molotov.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        artistId: lescop.id,
        venueId: molotov.id,
        eventDate: new Date("2026-03-15"),
        eventTime: "21:00",
        price: 20.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      {
        slug: "yelle-molotov-marseille-2026",
        title: "Yelle - Marseille Électro",
        description: "Show électro-pop de Yelle au Molotov.",
        imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
        artistId: yelle.id,
        venueId: molotov.id,
        eventDate: new Date("2026-04-25"),
        eventTime: "20:30",
        price: 23.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "fishbach-poste-galene-2026",
        title: "Fishbach - Live Électro Sombre",
        description: "Performance intimiste à La Poste à Galène.",
        imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        artistId: fishbach.id,
        venueId: poste.id,
        eventDate: new Date("2026-04-05"),
        eventTime: "21:00",
        price: 18.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "pendentif-boite-joujoux-2026",
        title: "Pendentif - Indie Session",
        description: "Concert lo-fi intimiste de Pendentif.",
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        artistId: pendentif.id,
        venueId: boiteAJoujoux.id,
        eventDate: new Date("2026-06-10"),
        eventTime: "20:00",
        price: 14.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      // Bordeaux
      {
        slug: "alex-metric-iboat-bordeaux-2026",
        title: "Alex Metric - House Night",
        description: "Soirée house électronique sur l'I.Boat.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        artistId: alex.id,
        venueId: iboat.id,
        eventDate: new Date("2026-05-30"),
        eventTime: "23:00",
        price: 20.0,
        ticketUrl: "https://www.resident-advisor.net",
        status: "upcoming",
      },
      {
        slug: "superpoze-heretic-bordeaux-2026",
        title: "Superpoze - Bordeaux Beats",
        description: "Set électro de Superpoze au Heretic Club.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        artistId: superpoze.id,
        venueId: heretic.id,
        eventDate: new Date("2026-06-25"),
        eventTime: "22:00",
        price: 16.0,
        ticketUrl: "https://www.resident-advisor.net",
        status: "upcoming",
      },
      {
        slug: "videoclub-rok-solid-bordeaux-2026",
        title: "Videoclub - Rok Solid Session",
        description: "Concert intimiste de Videoclub au Rok Solid Sound.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        artistId: videoclub.id,
        venueId: roksolidSound.id,
        eventDate: new Date("2026-02-28"),
        eventTime: "20:30",
        price: 17.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "clara-luciani-iboat-bordeaux-2026",
        title: "Clara Luciani - Bordeaux Live",
        description: "Clara Luciani sur l'I.Boat avec vue sur la Garonne.",
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
        artistId: clara.id,
        venueId: iboat.id,
        eventDate: new Date("2026-04-28"),
        eventTime: "20:00",
        price: 23.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      // Toulouse
      {
        slug: "therapie-taxi-connexion-toulouse-2026",
        title: "Therapie TAXI - Toulouse Rock",
        description: "Concert rock énergique à Connexion Live.",
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        artistId: therapie.id,
        venueId: connexion.id,
        eventDate: new Date("2026-05-20"),
        eventTime: "20:30",
        price: 21.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      {
        slug: "yelle-metronum-toulouse-2026",
        title: "Yelle - Toulouse Électro",
        description: "Show électro-pop au Metronum.",
        imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
        artistId: yelle.id,
        venueId: metronum.id,
        eventDate: new Date("2026-05-02"),
        eventTime: "20:00",
        price: 24.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "holyTwo-rex-toulouse-2026",
        title: "The Holy Two - Rex Session",
        description: "Concert indie rock au Rex de Toulouse.",
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
        artistId: holyTwo.id,
        venueId: rex.id,
        eventDate: new Date("2026-05-14"),
        eventTime: "21:00",
        price: 16.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "fishbach-connexion-toulouse-2026",
        title: "Fishbach - Toulouse Dark",
        description: "Performance électro sombre à Connexion Live.",
        imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        artistId: fishbach.id,
        venueId: connexion.id,
        eventDate: new Date("2026-04-10"),
        eventTime: "21:00",
        price: 19.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      // Nantes
      {
        slug: "lescop-pannonica-nantes-2026",
        title: "Lescop - Nantes New Wave",
        description: "Concert new wave au Pannonica.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        artistId: lescop.id,
        venueId: pannonica.id,
        eventDate: new Date("2026-03-20"),
        eventTime: "21:00",
        price: 20.0,
        ticketUrl: "https://www.shotgun.live",
        status: "upcoming",
      },
      {
        slug: "clara-luciani-lieu-unique-nantes-2026",
        title: "Clara Luciani - Lieu Unique",
        description: "Concert exceptionnel au Lieu Unique.",
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
        artistId: clara.id,
        venueId: lieu.id,
        eventDate: new Date("2026-05-05"),
        eventTime: "20:00",
        price: 24.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "alex-metric-warehouse-nantes-2026",
        title: "Alex Metric - Warehouse Party",
        description: "Soirée house au Warehouse de Nantes.",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        artistId: alex.id,
        venueId: warehouse.id,
        eventDate: new Date("2026-06-05"),
        eventTime: "23:00",
        price: 18.0,
        ticketUrl: "https://www.resident-advisor.net",
        status: "upcoming",
      },
      {
        slug: "pendentif-pannonica-nantes-2026",
        title: "Pendentif - Lo-Fi Night",
        description: "Concert indie pop intimiste au Pannonica.",
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        artistId: pendentif.id,
        venueId: pannonica.id,
        eventDate: new Date("2026-06-15"),
        eventTime: "20:30",
        price: 15.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
      {
        slug: "videoclub-lieu-unique-nantes-2026",
        title: "Videoclub - Nantes Dreamy",
        description: "Concert pop électro rêveur au Lieu Unique.",
        imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        artistId: videoclub.id,
        venueId: lieu.id,
        eventDate: new Date("2026-03-05"),
        eventTime: "20:30",
        price: 19.0,
        ticketUrl: "https://www.dice.fm",
        status: "upcoming",
      },
    ]).returning();

    console.log(`✅ ${createdEvents.length} événements underground créés dans toute la France`);

    console.log("\n🎉 Seeding completed successfully!");
    console.log(`📊 Résumé:`);
    console.log(`   - 10 artistes underground/alternatifs`);
    console.log(`   - 19 petites salles (Paris, Lyon, Marseille, Toulouse, Bordeaux, Nantes)`);
    console.log(`   - ${createdEvents.length} événements`);
    console.log(`   - Prix des places : 14€ - 25€`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
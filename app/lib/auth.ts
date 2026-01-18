import {betterAuth} from "better-auth"; 
import {drizzleAdapter} from "better-auth/adapters/drizzle"; 
import {db} from "@/app/lib/db/drizzle"
import * as schema from "@/app/lib/db/schema"; 
import {nextCookies} from "better-auth/next-js"; 

export const auth = betterAuth({ 
    emailAndPassword: { 
        enabled: true, // On active les comptes par email et mot de passe 
    }, 
    database: drizzleAdapter(db, { 
        provider: "pg", 
        schema,
    }), 
    user: {
        additionalFields: {
            bio: {
                type: "string",
                required: false,
                defaultValue: "",
                input: true, // Permet de le passer dans les inputs
            },
        },
    },
    plugins: [nextCookies()], // ⚠  Permet de sauvegarder les cookies better-auth dans l'appli next 
});
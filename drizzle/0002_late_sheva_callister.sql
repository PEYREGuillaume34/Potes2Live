CREATE TABLE "favorite_artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"artist_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "concert_reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "favorite_artists" ADD CONSTRAINT "favorite_artists_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_artists" ADD CONSTRAINT "favorite_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "favorite_artists_user_artist_unique" ON "favorite_artists" USING btree ("user_id","artist_id");--> statement-breakpoint
CREATE INDEX "favorite_artists_user_idx" ON "favorite_artists" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "favorite_artists_artist_idx" ON "favorite_artists" USING btree ("artist_id");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "venues" DROP COLUMN "capacity";
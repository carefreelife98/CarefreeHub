CREATE TABLE "analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"query" varchar(255) NOT NULL,
	"parsed_params" jsonb NOT NULL,
	"competitors" jsonb NOT NULL,
	"insights" jsonb NOT NULL,
	"concept" jsonb NOT NULL,
	"final_report" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(20) NOT NULL,
	"app_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"score" numeric(2, 1) NOT NULL,
	"ratings" integer NOT NULL,
	"installs" varchar(50) NOT NULL,
	"genre" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"icon_url" text NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid,
	"steps" jsonb NOT NULL,
	"markdown" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competitor_id" uuid NOT NULL,
	"platform" varchar(20) NOT NULL,
	"review_id" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"score" integer NOT NULL,
	"thumbs_up" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prds" ADD CONSTRAINT "prds_analysis_id_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_competitor_id_competitors_id_fk" FOREIGN KEY ("competitor_id") REFERENCES "public"."competitors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "platform_app_id_idx" ON "competitors" USING btree ("platform","app_id");
CREATE TABLE "composio_connection" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"toolkit_slug" text NOT NULL,
	"auth_config_id" text NOT NULL,
	"connected_account_id" text,
	"status" text DEFAULT 'INITIATED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "composio_connection_org_toolkit_idx" ON "composio_connection" USING btree ("organization_id","toolkit_slug");
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js reads .env.local; the Prisma CLI does not, so load it explicitly.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});

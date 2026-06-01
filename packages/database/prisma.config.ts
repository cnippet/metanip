import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // Use a dummy URL for generation if DATABASE_URL is not available
    // prisma generate doesn't need a real database connection
    url:
      process.env.DATABASE_URL ||
      "postgresql://dummy:dummy@localhost:5432/dummy",
  },
  migrations: {
    path: "prisma/migrations",
  },
  schema: "prisma/schema.prisma",
});

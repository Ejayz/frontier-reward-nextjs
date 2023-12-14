import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./schema.ts",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    password: "",
    database: "frontier_rewards",
    port: 3306,
    user: "root",
  },
  verbose: true,
  strict: true,
});

import type { Config } from "drizzle-kit";
export default {
  schema: "./src/schema/*",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "frontier_rewards",
  },
} satisfies Config;

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
export default async function connection() {
  const connection = await mysql.createPool({
    host: "localhost",
    user: "root",
    database: "frontier_rewards",
    password: "",
    port: 3306,
  });
  return drizzle(connection);
}

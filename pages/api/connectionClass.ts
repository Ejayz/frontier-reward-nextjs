
import mysql, { Pool, PoolConnection } from 'mysql2/promise';
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export  class Connection {
  private static instance: Connection;
  private pool: Pool;

  private constructor() {
    // Set up your MySQL connection pool parameters
    const poolConfig: mysql.PoolOptions = {
      host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    idleTimeout: 5000,
    queueLimit: 0,
    };

    this.pool = mysql.createPool(poolConfig);
  }

  public static getInstance(): Connection {
    if (!this.instance) {
      this.instance = new Connection();
    }

    return this.instance;
  }

  public async getConnection(): Promise<PoolConnection> {
    return this.pool.getConnection();
  }

  // You can add other methods or configurations as needed

  public async closePool(): Promise<void> {
    await this.pool.end();
  }
}


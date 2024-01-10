import mysql from "mysql2/promise";
import *as dotenv from "dotenv"
dotenv.config()
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const Connection  = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password:DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
 
  });



export default  Connection
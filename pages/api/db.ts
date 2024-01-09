import mysql from "mysql2/promise";

const Connection  = mysql.createPool({
    host: "localhost",
    user: "root",
    password:"",
    database: "fronteir_rewards_normed",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
 
  });



export default  Connection
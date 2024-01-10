import { NextApiRequest, NextApiResponse } from "next";

import Cookies from "cookies";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Connection from "../../db";
import { RowDataPacket } from "mysql2/promise";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await Connection.getConnection();
  try {
    const verify = await jwt.verify(auth, JWT_SECRET);
    const [packageListResult, packageListFields] = <RowDataPacket[]> await connection.query( `SELECT id as value , name as text FROM packages WHERE is_exist=1 ORDER BY id DESC` );


    return res.status(200).json({ data: packageListResult });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    } else if (err.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } finally {
    await Connection.releaseConnection(connection);
  }
}

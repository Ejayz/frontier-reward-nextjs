import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
import Cookies from "cookies";
import Connection from "../../db";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      code: 405,
      message: "Invalid method. This endpoint only accept GET method",
    });
  }
  const connection=await Connection.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    jwt.verify(auth, JWT_SECRET);
    const reqQuery = parseInt(req.query.page as string) || 1;
    const skip = (reqQuery - 1) * 5;
    const take = 5;
    const [packagesResult, packagesFields] = await connection.query( `SELECT * FROM package_reward_list WHERE is_exist=1 ORDER BY id DESC LIMIT ?,?`, [skip, take] );

    return res.status(200).json({ code: 200, data: packagesResult });
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    } else if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else if (e.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      return res.status(500).json({ code: 500, message: e.message });
    }
  } finally {
    await connection.release();
  }
}
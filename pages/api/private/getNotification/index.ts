import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
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
  const connection=await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      // Handle the case where verify is a string (no access to id)
      res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
    } else {
      res.status(401).json({ code: 401, message: "Invalid token format" });
    }
    //console.log("current_user", current_user);
    const reqQuery = parseInt(req.query.page as string) || 1;
    const skip = (reqQuery - 1) * 10;
    const take = 10;
    const [actionResult, actionFields] =<RowDataPacket[]> await connection.query( `SELECT * FROM notification Where is_exist=1 ORDER BY id DESC LIMIT ?,?`, [skip, take]);
    return res.status(200).json({ code: 200, data: actionResult });
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

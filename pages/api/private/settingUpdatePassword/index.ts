import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";
import Cookies from "cookies";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const auth = (await Cookies(req, res).get("auth")) || "";
  const connection = await instance.getConnection();
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      res.status(401).json({ code: 401, message: "Invalid token" });
      return;
    }
    console.log(verify)
    const { password } = req.body;
    const { id } = verify;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE users SET password = ?, password_change_at=current_timestamp() WHERE id = ? and is_exist=1`,
        [hashedPassword, id]
      )
    );
    if (rows.affectedRows === 0) {
      res.status(404).json({ code: 404, message: "User not found" });
      return;
    }
    res.status(200).json({ code: 200, message: "Password updated" });
  } catch (error: any) {
    console.log(error)
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ code: 401, message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (error.name === "NotBeforeError") {
      res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      res.status(500).json({ code: 500, message: "Internal server error" });
    }
  } finally {
    await connection.release();
  }
}

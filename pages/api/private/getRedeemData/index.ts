import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";
import Cookies from "cookies";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const { id } = req.body;
  const auth = (await Cookies(req, res).get("auth")) || "";
  const connection = await instance.getConnection();

  try {
    const verify = await jwt.verify(auth, JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    const [rows] = <RowDataPacket[]>(
      await connection.query(`select * from redeem where id=? and is_exist=1`, [
        id,
      ])
    );
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: "Not found" });
    }
    return res
      .status(200)
      .json({ code: 200, message: "Success", data: rows[0] });
  } catch (error) {
  } finally {
    await connection.release();
  }
}

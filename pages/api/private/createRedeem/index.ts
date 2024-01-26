import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({ code: 405, message: "Only POST requests allowed" });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    const { name, description, cost, package_id, reward_id } = req.body;

    const [rows] = <RowDataPacket[]>(
      await connection.query(
        "INSERT INTO redeem (name, description, point_cost, package_id, reward_id,employee_id) VALUES (?, ?, ?, ?, ?,?)",
        [name, description, cost, package_id, reward_id, verify.id]
      )
    );
    if (rows.affectedRows === 0) {
      return res.status(400).json({ code: 400, message: "Bad Request" });
    }
    return res
      .status(200)
      .json({ code: 200, message: "New redeemable added." });
  } catch (error: any) {
    console.log(error);
    if (error.message === "jwt expired") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    return res
      .status(500)
      .json({ code: 500, message: "Internal Server Error" });
  } finally {
    await connection.release();
  }
}

import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  try {
    const verify = (await jwt.verify(auth, JWT_SECRET)) || "";
    if (typeof verify === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { main_id } = verify;
    const [notifications] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * FROM notification_admin WHERE id NOT IN (SELECT notification_id FROM notification_records_admin WHERE employee_id = ? and is_exist=1);`,
        [main_id]
      )
    );
    console.log(notifications);
    return res.status(200).json({ code: 200, data: notifications });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  } finally {
    await connection.release();
  }
}

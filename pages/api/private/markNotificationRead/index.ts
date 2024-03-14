import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  const { notification_id } = req.body;
  try {
    const verify = jwt.verify(auth, JWT_SECRET) || "";
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    const { main_id } = verify;
    const [isRead] = <RowDataPacket[]>(
      await connection.query(
        `INSERT INTO notification_records_admin (notification_id, employee_id) VALUES (?, ?);`,
        [notification_id, main_id]
      )
    );
    if (isRead.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "Failed to mark notification as read" });
    }
    return res
      .status(200)
      .json({ code: 200, message: "Notification marked as read" });
  } catch (error: any) {
    return res.status(500).json({ code: 500, message: error.message });
  } finally {
    await connection.release();
  }
}

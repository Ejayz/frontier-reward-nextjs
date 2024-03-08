import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { RowDataPacket } from "mysql2";
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
  const { vin_no } = req.body;

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [vehicle] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * FROM customer_vehicle_info WHERE vin_id = ? and is_exist=1 and customer_info_id IS NULL`,
        [vin_no]
      )
    );
    if (vehicle.length === 0) {
      return res.status(404).json({ code: 404, message: "Vehicle not found" });
    }
    return res
      .status(200)
      .json({ code: 200, message: "Success", data: vehicle });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    connection.release();
  }
}

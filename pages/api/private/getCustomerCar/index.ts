import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({code:405, message: "Method not allowed" });
  }

  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();

  try {
    const verify = jwt.verify(auth, JWT_SECRET);

    if (typeof verify === "string") {
      return res.status(401).json({code:401, message: "User is not authenticated" });
    }

    const { user_id, page } = req.query;

    const offset=page?parseInt(page.toString())*5:0;
    const limit=5;

    const [customerVehicleResult, customerVehicleFields] = <RowDataPacket[]>(
      await connection.query(
        `SELECT *,vin_id as vin_no, id as table_uuid ,(true) AS isFromDb FROM customer_vehicle_info WHERE customer_info_id=? and is_exist=1 LIMIT ?,?`,
        [user_id, offset, limit]
      )
    );

    console.log(customerVehicleResult);
    if (customerVehicleResult.length == 0) {
      return res
        .status(404)
        .json({ code:404, message: "No vehiclle found from this customer" });
    }
    return res
      .status(200)
      .json({ code: 200, message: "Success", data: customerVehicleResult });
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({code:401, message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({code:401,message: "Invalid token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({code:401, message: "Token not active" });
    } else {
      return res.status(500).json({code:401, message: "Internal server error" });
    }
  } finally {
    await connection.release();
  }
}

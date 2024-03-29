import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
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
  const connection = await instance.getConnection();
  const { user_id } = req.query;

  let rows;
  let fields;
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }

    [rows] = <RowDataPacket[]>(
      await connection.query(
        `SELECT  first_name,last_name,suffix,middle_name,email,phone_number,points,address_1,address_2,country,city,zip_code,state_province,name,customer_info.created_at,packages.multiplier as multiplier from customer_info LEFT JOIN users ON customer_info.user_id = users.id LEFT JOIN customer_address ON customer_address.id=customer_info.id LEFT JOIN  packages  ON packages.id = customer_info.package_id where customer_info.id = ? and customer_info.is_exist =1  `,
        [user_id]
      )
    );
    console.log(rows);
    return res
      .status(200)
      .json({ code: 200, message: "Success", data: rows[0] });
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
  } finally {
    await connection.release();
  }
}

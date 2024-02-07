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
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const connection = await instance.getConnection();
  console.log(req.query);
  const { keyword, page } = req.query;
  const formattedKeyword = `*${keyword}*`;
  const auth = new Cookies(req, res).get("auth") || "";
  const offset = page ? parseInt(page.toString()) * 10 : 0;
  const limit = 10;
  let rows;
  let fields;
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }

    if (keyword != "") {
      [rows, fields] = <RowDataPacket[]>(
        await connection.query(
          `SELECT *,packages.name as package_name, customer_info.id as customer_id FROM customer_info LEFT JOIN users ON customer_info.user_id = users.id  LEFT JOIN user_type ON users.user_type = user_type.id LEFT JOIN customer_address ON customer_info.address_id = customer_address.id LEFT JOIN packages ON packages.id=customer_info.package_id WHERE ( 
            MATCH (users.email) AGAINST (? IN BOOLEAN MODE)  OR 
            MATCH (customer_info.first_name) AGAINST (? IN BOOLEAN MODE) OR 
            MATCH(customer_info.middle_name) AGAINST (? IN BOOLEAN MODE) OR 
            MATCH (customer_info.last_name) AGAINST (? IN BOOLEAN MODE)  ) AND  users.is_exist=1 and users.user_type=4  LIMIT ? OFFSET ?`,
          [
            formattedKeyword,
            formattedKeyword,
            formattedKeyword,
            formattedKeyword,
            limit,
            offset,
          ]
        )
      );
    } else {
      [rows, fields] = <RowDataPacket[]>(
        await connection.query(
          `SELECT * ,packages.name as package_name, customer_info.id as customer_id FROM customer_info LEFT JOIN users ON customer_info.user_id = users.id  LEFT JOIN user_type ON users.user_type = user_type.id LEFT JOIN customer_address ON customer_info.address_id = customer_address.id LEFT JOIN packages ON packages.id=customer_info.package_id WHERE users.is_exist=1 and users.user_type=4  LIMIT ? OFFSET ? `,
          [limit, offset]
        )
      );
    }
  
    return res.status(200).json({ code: 200, message: "Success", data: rows });
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "jwt expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "jwt malformed" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "jwt not active" });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    }
  } finally {
    await connection.release();
  }
}

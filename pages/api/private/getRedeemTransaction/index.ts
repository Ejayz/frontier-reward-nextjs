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
  const { keyword, page } = req.query;
  const offset = page ? parseInt(page.toString()) * 5 : 0;
  const limit = 5;
  const formattedKeyword = `*${keyword}*`;
  let rows;
  let fields;
  try {
    if (keyword != "") {
      [rows] = <RowDataPacket[]>(
        await connection.query(
          `SELECT  *,redeem_transaction.id as CoreID,redeem.name as redeem_name,redeem.name as redeem_name,CONCAT(customer_info.first_name ," ",customer_info.middle_name," " , customer_info.last_name) AS customer_name , redeem_transaction.status as Status FROM redeem_transaction  LEFT JOIN redeem ON redeem.id=redeem_transaction.redeem_id LEFT JOIN reward ON reward.id=redeem.reward_id LEFT JOIN customer_info ON customer_info.id = redeem_transaction.customer_id WHERE ( MATCH(redeem_transaction.transaction_no) AGAINST (? IN BOOLEAN MODE)  OR  MATCH(redeem.name) AGAINST (? IN BOOLEAN MODE) OR  MATCH(customer_info.first_name) AGAINST (? IN BOOLEAN MODE) OR MATCH(customer_info.middle_name) AGAINST (? IN BOOLEAN MODE) OR MATCH(customer_info.last_name) AGAINST (? IN BOOLEAN MODE) )  AND  redeem_transaction.is_exist=1 ORDER BY redeem_transaction.created_at LIMIT ? , ?`,
          [
            formattedKeyword,
            formattedKeyword,
            formattedKeyword,
            formattedKeyword,
            formattedKeyword,
            offset,
            limit,
          ]
        )
      );
    } else {
      [rows] = <RowDataPacket[]>(
        await connection.query(
          `SELECT  *,redeem_transaction.id as CoreID,redeem.name as redeem_name,redeem.name as redeem_name,CONCAT(customer_info.first_name ," ",customer_info.middle_name," " , customer_info.last_name) AS customer_name , redeem_transaction.status as Status FROM redeem_transaction  LEFT JOIN redeem ON redeem.id=redeem_transaction.redeem_id LEFT JOIN reward ON reward.id=redeem.reward_id LEFT JOIN customer_info ON customer_info.id = redeem_transaction.customer_id  WHERE redeem_transaction.is_exist=1 ORDER BY redeem_transaction.created_at DESC LIMIT ? , ?`,
          [offset, limit]
        )
      );
    }
    console.log(rows);
    return res.status(200).json({ code: 200, message: "Success", data: rows });
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

import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
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
  const { id } = req.query;
  console.log(id);
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }

    const [rows] = <RowDataPacket[]>(
      await connection.query(
        `SELECT  *,redeem.description as redeem_description,reward.name as RewardName ,reward.description as RewardDescription,redeem_transaction.id as CoreID,redeem.name as redeem_name,redeem.name as redeem_name,CONCAT(customer_info.first_name ," ",customer_info.middle_name," " , customer_info.last_name) AS customer_name , redeem_transaction.status as Status FROM redeem_transaction  LEFT JOIN redeem ON redeem.id=redeem_transaction.redeem_id LEFT JOIN reward ON reward.id=redeem.reward_id LEFT JOIN customer_info ON customer_info.id = redeem_transaction.customer_id  WHERE redeem_transaction.id=? and redeem_transaction.is_exist=1 `,
        [id]
      )
    );
    console.log(rows);
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: "Not found" });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: rows,
      transaction_no: rows[0].transaction_no,
    });
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

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
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { user_id } = req.query;
  const page = req.query.page || 0;
  const limit = 10;
  const offset = page ? parseInt(page.toString()) * 10 : 0;
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  console.log(page, limit, offset, user_id, auth);
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ message: "User is not authenticated" });
    }
    const [rows, fields] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * ,campaign_transaction.id as CoreId, campaign.name as campaign_name,campaign_transaction.status as transaction_status, CONCAT(employee_info.first_name," ",employee_info.middle_name," ",employee_info.last_name) as EmployeeFullName ,CONCAT(customer_info.first_name," ",customer_info.middle_name," ",customer_info.last_name) as CustomerFullName FROM campaign_transaction  LEFT JOIN  campaign ON campaign_transaction.campaign_id = campaign.id LEFT JOIN  employee_info ON campaign_transaction.employee_id=employee_info.id LEFT JOIN customer_info ON campaign_transaction.customer_id=customer_info.id WHERE campaign_transaction.is_exist=1 and campaign_transaction.customer_id=? LIMIT ? , ?`,
        [user_id, offset, limit]
      )
    );
    console.log(rows);
    return res.status(200).json({ code: 200, data: rows });
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
    connection.release();
  }
}

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
  if (req.method !== "GET") {
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
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ message: "User is not authenticated" });
    }
    console.log(keyword);
    if (keyword != "") {
      [rows, fields] = <RowDataPacket[]>(
        await connection.query(
          `SELECT * , campaign.name as campaign_name,campaign_transaction.status as transaction_status,CONCAT(employee_info.first_name," ",employee_info.middle_name," ",employee_info.last_name) as EmployeeFullName , CONCAT(customer_info.first_name," ",customer_info.middle_name," ",customer_info.last_name) as CustomerFullName FROM campaign_transaction  LEFT JOIN  campaign ON campaign_transaction.campaign_id = campaign.id LEFT JOIN  employee_info ON campaign_transaction.employee_id=employee_info.id LEFT JOIN customer_info ON campaign_transaction.customer_id=customer_info.id WHERE ( MATCH(campaign_transaction.transaction_no) AGAINST (? IN BOOLEAN MODE)  OR  MATCH(campaign.name) AGAINST (? IN BOOLEAN MODE) OR  MATCH(employee_info.first_name) AGAINST (? IN BOOLEAN MODE) OR MATCH (customer_info.first_name) AGAINST (? IN BOOLEAN MODE) OR  MATCH(customer_info.middle_name) AGAINST (? IN BOOLEAN MODE) OR  MATCH(customer_info.last_name) AGAINST (? IN BOOLEAN MODE) OR  MATCH (employee_info.first_name) AGAINST (? IN BOOLEAN MODE) OR  MATCH (employee_info.middle_name) AGAINST (? IN BOOLEAN MODE) OR  MATCH (employee_info.last_name) AGAINST (? IN BOOLEAN MODE) )  AND  campaign_transaction.is_exist=1 LIMIT ? , ?`,
          [formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword, offset, limit]
        )
      );
    } else {
      [rows, fields] = <RowDataPacket[]>(
        await connection.query(
          `SELECT * , campaign.name as campaign_name,campaign_transaction.status as transaction_status, CONCAT(employee_info.first_name," ",employee_info.middle_name," ",employee_info.last_name) as EmployeeFullName ,CONCAT(customer_info.first_name," ",customer_info.middle_name," ",customer_info.last_name) as CustomerFullName FROM campaign_transaction  LEFT JOIN  campaign ON campaign_transaction.campaign_id = campaign.id LEFT JOIN  employee_info ON campaign_transaction.employee_id=employee_info.id LEFT JOIN customer_info ON campaign_transaction.customer_id=customer_info.id WHERE campaign_transaction.is_exist=1 LIMIT ? , ?`,
          [offset, limit]
        )
      );
    }

    return res.status(200).json({ message: "Success", data: rows });
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  } finally {
    await connection.release();
  }
}

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
  const { id } = req.query;

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    const [rows, fields] = <RowDataPacket[]>(
      await connection.query(
        `SELECT *,campaign_transaction.status as TransactionStatus,reward.name as reward_name, reward.description as reward_description ,actions.name as action_name,actions.description as action_description, campaign.name as campaign_name,campaign_transaction.status as transaction_status,CONCAT(employee_info.first_name," ",employee_info.middle_name," ",employee_info.last_name) as EmployeeFullName , CONCAT(customer_info.first_name," ",customer_info.middle_name," ",customer_info.last_name) as CustomerFullName FROM campaign_transaction  LEFT JOIN  campaign ON campaign_transaction.campaign_id = campaign.id LEFT JOIN  employee_info ON campaign_transaction.employee_id=employee_info.id LEFT JOIN customer_info ON campaign_transaction.customer_id=customer_info.id LEFT JOIN campaign_action_reward_list ON campaign_action_reward_list.campaign_id=campaign.id LEFT JOIN actions ON campaign_action_reward_list.action_id = actions.id LEFT JOIN reward ON reward.id = campaign_action_reward_list.reward_id WHERE campaign_transaction.id=? AND campaign_transaction.is_exist=1`,
        [id]
      )
    );
    const merged_same_action_id = mergeArrayObjectsByActionId(rows);
    console.log(merged_same_action_id);
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: "Not found" });
    }
    return res.status(200).json({
      code: 200,
      data: merged_same_action_id,
      transaction_no: rows[0].transaction_no,
      status: rows[0].TransactionStatus,
    });
  } catch (error: any) {
    console.log(error)
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
function mergeArrayObjectsByActionId(arr: any) {
    const groupedArray: any[] = [];
  
    arr.forEach((obj: any) => {
      const { action_id, action_name, action_description, ...rest } = obj;
      const existingGroup = groupedArray.find(
        (group) => group.action_id === action_id
      );
  
      if (existingGroup) {
        existingGroup.data.push({ ...rest });
      } else {
        groupedArray.push({
          action_id,
          action_name,
          action_description,
          data: [{ ...rest }],
        });
      }
    });
  
    return groupedArray;
  }

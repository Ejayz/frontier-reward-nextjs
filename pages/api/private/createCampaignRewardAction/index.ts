import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import Connection from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await Connection.getConnection();
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      // Handle the case where verify is a string (no access to id)
      res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
    } else {
      res.status(401).json({ code: 401, message: "Invalid token format" });
    }

    const {
      quantity,
      status,
      action_id,
      reward_id,
      employee_id,
      campaign_id,
      created_at,
      is_exist,
    } = req.body;

    const [results, fields] = <RowDataPacket[]>(
      await connection.query(
        `INSERT INTO campaign_action_reward_list (quantity,status,action_id,reward_id,employee_id,campaign_id,created_at,is_exist) VALUES (?,?,?,?,?,?,?,?)`,
        [quantity, "pending", action_id, reward_id, current_user, campaign_id, created_at, 1]
      )
    );
    if (results.affectedRows > 0) { 
      res
        .status(201)
        .json({ code: 201, message: "Action created successfully" });
    } else {
      res
        .status(500)
        .json({ code: 500, message: "Something went wrong.Please try again" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
  finally{
    await connection.release();
  }
}

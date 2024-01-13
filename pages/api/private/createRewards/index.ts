import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import { RowDataPacket } from "mysql2";
import instance from "../../db";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_API = process.env.RESEND_SECRET || "";
const BASE_URL = process.env.BASE_URL || "";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
  const verify = jwt.verify(auth, JWT_SECRET);
  let current_user = 0;
  if (typeof verify === "string") {
    return res.status(401).json({ code: 401, message: "Invalid token" });
  } else if (verify?.main_id) {
    // Access the id property only if it exists in the JwtPayload
    current_user = verify.main_id;
    console.log("Current user ID:", current_user);
  } else {
    return res.status(401).json({ code: 401, message: "Invalid token format" });
  }
 
  const {
    name,
    description,
    quantity,
    reward_type_id,
    employee_id,
    created_at,
    updated_at,
    removed_at,
    is_exist,
  } = req.body;

  const [createRewardsResult, createRewardsFields] = <RowDataPacket[]>await connection.query( `INSERT INTO rewards (name,description,quantity,reward_type_id,employee_id,is_exist) VALUES (,?,?,?,?,?,?)`, 
  [name,description,quantity,reward_type_id,employee_id,is_exist] );

  if (createRewardsResult.affectedRows == 0) {
    return res.status(500).json({code:500, message: "Something went wrong" });
  }else{
    return res.status(200).json({code:200, message: "Successfully created rewards" });
  }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }finally{
    await connection.release();
  }
}

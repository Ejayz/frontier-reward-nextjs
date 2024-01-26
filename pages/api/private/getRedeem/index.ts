import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import instance from "../../db";
import Cookies from "cookies";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  const auth = (await Cookies(req, res).get("auth")) || "";
  const connection = await instance.getConnection();
  const { page } = req.query;
  const offset = page ? parseInt(page.toString()) * 5 : 0;
  const limit = 5;
  let rows;
  let fields;
  try {
    const verify = jwt.verify(auth, JWT_SECRET);

    console.log(
      `select *,reward.name as reward_name,packages.name as packages.name as package_name from redeem LEFT JOIN reward ON reward.id = redeem.reward_id LEFT JOIN packages ON packages.id = redeem.package_id where is_exist=1 limit ${offset} , ${limit}`
    );
    [rows] = <RowDataPacket[]>(
      await connection.query(
        `select *,redeem.id as redeem_id,redeem.name as redeem_name,redeem.description as redeem_description,reward.name as reward_name, packages.name as package_name from redeem LEFT JOIN reward ON reward.id = redeem.reward_id LEFT JOIN packages ON packages.id = redeem.package_id where  redeem.is_exist=1 ORDER BY redeem.created_at DESC limit ? , ?`,
        [offset, limit]
      )
    );
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

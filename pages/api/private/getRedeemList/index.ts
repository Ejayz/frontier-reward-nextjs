import { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2";
import instance from "../../db";
import Cookies from "cookies";
import * as jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      code: 405,
      message: "Invalid method. This endpoint only accept GET method",
    });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  const decode = jwt.decode(auth);
  if (typeof decode === "string" || decode === null) {
    return res.status(401).json({ code: 401, message: "Invalid Token" });
  }
  const reqQuery = parseInt(req.query.page as string) || 0;
  const skip = reqQuery * 10 - 1 == -1 ? 0 : reqQuery * 10 - 1;
  const take = 10;
  try {
    const [campaignResult] = <RowDataPacket[]>(
      await connection.query(
        `SELECT *,redeem.id as RedeemID,reward.name as RewardName, reward.description as RewardDescription, redeem.name as RedeemName,redeem.description as RedeemDescription ,redeem.status as status  FROM redeem LEFT join reward ON reward.id = redeem.reward_id WHERE redeem.is_exist=1 and package_id=?  ORDER BY redeem.id DESC LIMIT ?,?`,
        [decode.package_id, skip, take]
      )
    );
    return res.status(200).json({ code: 200, data: campaignResult });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ code: 500, message: error.message });
  } finally {
    connection.release();
  }
}

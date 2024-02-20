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

  try {
    const [campaignResult] = <RowDataPacket[]>(
      await connection.query("select points from customer_info where id=?", [
        decode.main_id,
      ])
    );
    console.log(campaignResult);
    return res.status(200).json({ code: 200, data: campaignResult[0].points });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ code: 500, message: error.message });
  } finally {
    connection.release();
  }
}

import { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";

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

  try {
    const reqQuery = parseInt(req.query.page as string) || 1;
    const skip = (reqQuery - 1) * 10;
    const take = 10;
    const [rewardsResult, rewardsFields] =<RowDataPacket[]> await connection.query( `SELECT * FROM reward WHERE is_exist=1 ORDER BY id DESC LIMIT ?,?`, [skip, take] );

    return res.status(200).json({ code: 200, data: rewardsResult });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ code: 400, message: "Something went wrong" });
  } finally {
  await connection.release();
  }
}

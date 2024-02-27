import Cookies, { connect } from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const { points, customer_id } = req.body;
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    const decoded_token = jwt.decode(auth);
    if (typeof verify === "string") {
      return res.status(401).json({
        code: 401,
        message: "Authentication expird or invalid. Please try again.",
      });
    }
    if (!verify) {
      return res.status(401).json({
        code: 401,
        message: "Authentication expird or invalid. Please try again.",
      });
    }
    console.log(verify);

    connection.beginTransaction();
    const query =
      "INSERT INTO `fronteir_rewards_normed_dev_mode`.`points_transaction` (`points`,  `customer_updated_points`, `customer_id`, `employee_id`) VALUES (?, ?, ?, ?);";
    const [rows, fields] = <RowDataPacket[]>(
      await connection.query(query, [
        points,
        points,
        customer_id,
        verify.main_id,
      ])
    );
    if (rows.affectedRows < 0) {
      connection.rollback();
      res
        .status(500)
        .json({ code: 500, message: "Something went wrong.Please try again" });
    }
    const [updatePoints] = <RowDataPacket[]>(
      await connection.query(
        "UPDATE customer_info SET points=? , updated_at=CURRENT_TIMESTAMP  where is_exist=1 and id=?",
        [points, customer_id]
      )
    );
    if (updatePoints.affectedRows > 0) {
      connection.commit();
      return res
        .status(200)
        .json({ code: 200, message: "Points added to customer account." });
    } else {
      connection.rollback();
      return res
        .status(500)
        .json({ code: 500, message: "Something went wrong.Please try again" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      code: 405,
      message: "Something went wrong . Please try again !",
    });
  } finally {
    connection.release();
  }
}

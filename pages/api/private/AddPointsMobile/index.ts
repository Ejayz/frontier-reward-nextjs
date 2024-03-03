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
  const { points, multiplier, customer_id } = req.body;
  console.log(points, multiplier, customer_id);
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  const total_points = points * multiplier + points;
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    const decoded_token = jwt.decode(auth);
    if (typeof verify === "string") {
      return res.status(401).json({
        code: 401,
        message: "Authentication expired or invalid. Please try again.",
      });
    }
    if (!verify) {
      return res.status(401).json({
        code: 401,
        message: "Authentication expired or invalid. Please try again.",
      });
    }
    console.log(verify);
    const [getCustomerPoints] = <RowDataPacket[]>(
      await connection.query(
        "select * from customer_info where id=? and is_exist=1",
        [customer_id]
      )
    );

    const convertedCustomerPoints = parseFloat(getCustomerPoints[0].points);
    const convertedTotalPoints = parseFloat(total_points);
    const customer_updated_points =
      convertedCustomerPoints + convertedTotalPoints;

    console.log(convertedCustomerPoints);
    console.log(convertedTotalPoints);
    console.log(customer_updated_points);
    connection.beginTransaction();
    const query =
      "INSERT INTO `fronteir_rewards_normed_dev_mode`.`points_transaction` (`points`, `multiplier`, `total_points`, `customer_updated_points`, `customer_id`, `employee_id`) VALUES (?, ?, ?, ?, ?, ?);";
    const [rows, fields] = <RowDataPacket[]>(
      await connection.query(query, [
        points,
        multiplier,
        total_points,
        customer_updated_points,
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
        [customer_updated_points, customer_id]
      )
    );
    if (updatePoints.affectedRows > 0) {
      connection.commit();
      return res.status(200).json({
        code: 200,
        message: `A total of ${total_points} Frontier was added to customer account.`,
      });
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

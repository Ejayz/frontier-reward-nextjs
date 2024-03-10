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
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  const { id, transaction_no } = req.body;

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }
    connection.beginTransaction();
    const [getTransactionInformation] = <RowDataPacket[]>(
      await connection.query(
        "SELECT * FROM redeem_transaction where transaction_no=? and is_exist=1",
        [transaction_no]
      )
    );

    const [getCustomerInformation] = <RowDataPacket[]>(
      await connection.query(
        "SELECT * FROM customer_info where id = ? and is_exist=1",
        [getTransactionInformation[0].customer_id]
      )
    );
    const redeemPointsUsed = getTransactionInformation[0].points;
    const customerPoints = getCustomerInformation[0].points;
    const calculateReturn = redeemPointsUsed + customerPoints;

    const [returnPointsToCustomer] = <RowDataPacket[]>(
      await connection.query(
        "UPDATE customer_info SET points=? where id=? and is_exist=1",
        [calculateReturn, getTransactionInformation[0].customer_id]
      )
    );
    console.log(getTransactionInformation[0].customer_id);
    console.log(returnPointsToCustomer);
    if (returnPointsToCustomer.affectedRows !== 1) {
      connection.rollback();
      return res.status(500).json({
        code: 500,
        message: "Something went wrong. Please try again !",
      });
    }

    const [rows] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE redeem_transaction SET status="denied" , employee_id=? WHERE id=? and is_exist =1 and transaction_no=?`,
        [verify.id, id, transaction_no]
      )
    );
    if (rows.affectedRows !== 1) {
      connection.rollback();
      return res.status(500).json({
        code: 500,
        message: "Something went wrong. Please try again!",
      });
    }
    connection.commit();
    return res.status(200).json({
      code: 200,
      message: "Redeem transaction denied successfully.",
      data: rows,
    });
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

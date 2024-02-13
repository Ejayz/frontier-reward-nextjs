import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { generate } from "generate-password";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      code: 405,
      message: "Invalid method. This endpoint only accept POST method",
    });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  console.log(auth);
  try {
    const verify = jwt.verify(auth, JWT_SECRET);

    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    }

    let transactionNumber = null;
    const { campaign_id } = req.body;

    let x = 0;
    connection.beginTransaction();
    const [checkExistingTransaction] = <RowDataPacket[]>(
      await connection.query(
        "SELECT * FROM campaign_transaction WHERE campaign_id=? AND customer_id=? and status='pending' OR status='completed'",
        [campaign_id, verify.main_id]
      )
    );
    if (checkExistingTransaction.length > 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "You have pending transaction with this campaign . Please go to our nearest branch and do the actions to claim your rewards." });
    }
    for (x = 0; x < 1; x++) {
      transactionNumber = generate({
        length: 8,
        numbers: true,
        uppercase: true,
        lowercase: false,
        symbols: false,
        excludeSimilarCharacters: true,
      });
      const [checkTransaction] = <RowDataPacket[]>(
        await connection.query(
          `SELECT * FROM campaign_transaction WHERE transaction_no=?`,
          [transactionNumber]
        )
      );
      if (checkTransaction.length == 0) {
        break;
      } else {
        x = 1;
      }
    }
    const [insertTransaction] = <RowDataPacket[]>(
      await connection.query(
        `INSERT INTO campaign_transaction (transaction_no,campaign_id,customer_id) VALUES (?,?,?)`,
        [transactionNumber, campaign_id, verify.main_id]
      )
    );

    if (insertTransaction.affectedRows == 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Something went wrong" });
    }
    connection.commit();
    return res.status(200).json({
      code: 200,
      message: "Transaction Created",
      data: transactionNumber,
    });
  } catch (error: any) {
    console.log(error);
    if (error.message === "jwt expired") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    }
    if (error.message === "invalid token") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    }
    if (error.message === "invalid signature") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else {
      return res
        .status(400)
        .json({ code: 400, message: "Something went wrong" });
    }
  } finally {
    await connection.release();
  }
}

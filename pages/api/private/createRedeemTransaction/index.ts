import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { generate } from "generate-password";
import { get } from "http";
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
    const { redeem_id } = req.body;
    let x = 0;
    connection.beginTransaction();
    const [checkPoints] = <RowDataPacket[]>(
      await connection.query("select points from customer_info where id=?", [
        verify.main_id,
      ])
    );
    const userPoints = checkPoints[0].points;
    const [getPointsRequirement] = <RowDataPacket[]>(
      await connection.query("select * from redeem where id=? and is_exist=1", [
        redeem_id,
      ])
    );
    console.log(getPointsRequirement);
    const pointsRequirement = getPointsRequirement[0].point_cost;
    if (userPoints < pointsRequirement) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Insufficient points" });
    }
    const [checkStocks] = <RowDataPacket[]>(
      await connection.query("select * from reward where id=?", [
        getPointsRequirement[0].reward_id,
      ])
    );
    console.log(checkStocks);
    if (checkStocks[0].quantity == 0) {
      connection.rollback();
      return res.status(400).json({ code: 400, message: "Out of stocks" });
    }

    const updatedStock = checkStocks[0].quantity - 1;

    const [updateStocks] = <RowDataPacket[]>(
      await connection.query(
        "update reward set quantity=? where id=? AND is_exist=1",
        [updatedStock, getPointsRequirement[0].reward_id]
      )
    );
    if (updateStocks.affectedRows == 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Error updating Stocks." });
    }

    if (updatedStock == 0) {
      const [updateStatus] = <RowDataPacket[]>(
        await connection.query(
          "update redeem set status='out of stock' where reward_id=? and is_exist=1",
          [getPointsRequirement[0].reward_id]
        )
      );
      if (updateStatus.affectedRows == 0) {
        connection.rollback();
        return res
          .status(400)
          .json({ code: 400, message: "Error updating Redeem." });
      }
    }
    const [updatePoints] = <RowDataPacket[]>(
      await connection.query(
        "update customer_info set points=points-? where id=?",
        [pointsRequirement, verify.main_id]
      )
    );

    if (updatePoints.affectedRows == 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Error updating Points." });
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
          `SELECT * FROM redeem_transaction WHERE transaction_no=?`,
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
        `INSERT INTO redeem_transaction (transaction_no,redeem_id,customer_id,customer_point,points) VALUES (?,?,?,?,?)`,
        [
          transactionNumber,
          redeem_id,
          verify.main_id,
          userPoints,
          pointsRequirement,
        ]
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

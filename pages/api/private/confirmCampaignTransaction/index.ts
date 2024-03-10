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
  const { campaign_transaction_id, transaction_no } = req.body;
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    console.log(verify);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    connection.beginTransaction();

    const [getCampaignTransaction] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * FROM campaign_transaction WHERE id=? and transaction_no=?`,
        [campaign_transaction_id, transaction_no]
      )
    );

    if (getCampaignTransaction.length <= 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Transaction not found" });
    }

    if (getCampaignTransaction[0].status === "confirmed") {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Transaction already confirmed" });
    }

    const [getCampaignRewards] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * FROM campaign_action_reward_list INNER JOIN reward ON campaign_action_reward_list.reward_id = reward.id WHERE campaign_action_reward_list.campaign_id=? and reward.reward_type_id=1   and campaign_action_reward_list.is_exist=1`,
        [getCampaignTransaction[0].campaign_id]
      )
    );

    if (getCampaignRewards.lenght == 0) {
      connection.rollback();
      return res.status(500).json({
        code: 500,
        message: "Something went wrong . Please try again later.",
      });
    }

    const [getMultiplier] = <RowDataPacket[]>(
      await connection.query(
        "select * from customer_info INNER JOIN packages ON customer_info.package_id = packages.id where customer_info.id = ? and customer_info.is_exist = 1",
        [getCampaignTransaction[0].customer_id]
      )
    );
    if (getMultiplier.length == 0) {
      connection.rollback();
      return res.status(500).json({
        code: 500,
        message: "Something went wrong . Please try again later.",
      });
    }
    let points = getMultiplier[0].points;
    const multiplier = getMultiplier[0].multiplier;
    await getCampaignRewards.map((reward: any) => {
      const calculation = points + reward.points * multiplier;
      points = calculation;
    });

    const [updatePoints] = <RowDataPacket[]>(
      await connection.query(
        "UPDATE customer_info SET points=? where id=? and is_exist=1",
        [points, getCampaignTransaction[0].customer_id]
      )
    );
    if (updatePoints.affectedRows != 1) {
      connection.rollback();
      return res.status(500).json({
        code: 500,
        message: "Something went wrong . Please try again later.",
      });
    }
    console.log(updatePoints);
    const [UpdateCampaignTransaction] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE campaign_transaction SET status="confirmed",employee_id=? WHERE id=? and transaction_no=?`,
        [verify.id, campaign_transaction_id, transaction_no]
      )
    );
    if (updatePoints.affectedRows != 1) {
      connection.rollback();
      return res.status(500).json({
        code: 500,
        message: "Something went wrong . Please try again later.",
      });
    }
    console.log(UpdateCampaignTransaction);

    if (UpdateCampaignTransaction.affectedRows < 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Transaction not confirmed" });
    }
    connection.commit();
    return res.status(200).json({
      code: 200,
      message: "Campaign transaction confirmed successfully.",
    });
  } catch (error: any) {
    console.log(error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "jwt expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "jwt malformed" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "jwt not active" });
    } else {
      return res.status(401).json({
        code: 500,
        message: "Something went wrong. Please try again.",
      });
    }
  } finally {
    await connection.release();
  }
}

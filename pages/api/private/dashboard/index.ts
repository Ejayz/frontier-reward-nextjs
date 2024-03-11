import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";
import Cookies from "cookies";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ message: "Expired Token Login Again Please" });
    }
    const [numberOfUsers] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM users where is_exist=1"
      )
    );
    const [numberOfCampaign] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM campaign where is_exist=1"
      )
    );
    const [numberOfAction] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM actions where is_exist=1"
      )
    );
    const [numberOfPackage] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM packages where is_exist=1"
      )
    );
    const [numberOfPendingCampaignTransactions] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM campaign_transaction where status='pending' and is_exist=1"
      )
    );
    const [numberOfDeniedCampaignTransactions] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM campaign_transaction where status='denied' and is_exist=1"
      )
    );
    const [numberOfConfirmedCampaignTransaction] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM campaign_transaction where status='confirmed' and is_exist=1"
      )
    );
    const [numberOfRedeemPendingTransaction] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM redeem_transaction where status='pending' and is_exist=1"
      )
    );
    const [numberOfRedeemDeniedTransaction] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM redeem_transaction where status='denied' and is_exist=1"
      )
    );
    const [numberOfRedeemConfirmedTransaction] = <RowDataPacket[]>(
      await connection.query(
        "SELECT COUNT(*) as count FROM redeem_transaction where status='confirmed' and is_exist=1"
      )
    );
    const DashBoardData = {
      total_users: numberOfUsers[0].count,
      total_campaign: numberOfCampaign[0].count,
      total_action: numberOfAction[0].count,
      total_package: numberOfPackage[0].count,
      campaign: [
        numberOfPendingCampaignTransactions[0].count,
        numberOfDeniedCampaignTransactions[0].count,
        numberOfConfirmedCampaignTransaction[0].count,
      ],
      redeem: [
        numberOfRedeemPendingTransaction[0].count,
        numberOfRedeemDeniedTransaction[0].count,
        numberOfRedeemConfirmedTransaction[0].count,
      ],
    };
    console.log(DashBoardData);
    
    return res
      .status(200)
      .json({ code: 200, message: "Success", data: DashBoardData });
    
  } catch (error: any) {
    console.log(error);
    if (error.message === "jwt expired") {
      
      return res.status(401).json({ message: "jwt expired"});
    } else if (error.message === "jwt malformed") {
      return res.status(401).json({ message: "jwt malformed" });
    } else if (error.message === "jwt not active") {
      return res.status(401).json({ message: "jwt not active" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } finally {
    await connection.release();
  }
}

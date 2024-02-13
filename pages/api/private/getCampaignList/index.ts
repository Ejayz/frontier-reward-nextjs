import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
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

  try {
    const reqQuery = parseInt(req.query.page as string) || 0;
    const auth = new Cookies(req, res).get("auth") || "";

    const decode = jwt.decode(auth);
    if (typeof decode === "string" || decode === null) {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    }
    const skip = reqQuery * 10 - 1 == -1 ? 0 : reqQuery * 10 - 1;
    const take = 10;
    const [campaignResult] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * FROM campaign WHERE is_exist=1 and package_id=? ORDER BY id DESC LIMIT ?,?`,
        [decode.package_id, skip, take]
      )
    );
    const [CampaignActionList] = <RowDataPacket[]>(
      await connection.query(
        "SELECT *,actions.name as ActionName,actions.description as ActionDescription , reward.name as RewardName,reward.description as RewardDescription FROM campaign_action_reward_list LEFT JOIN reward ON reward.id=campaign_action_reward_list.reward_id LEFT JOIN actions ON actions.id=campaign_action_reward_list.action_id where campaign_action_reward_list.is_exist=1"
      )
    );

    const processedData = await processData(campaignResult, CampaignActionList);
    return res.status(200).json({ code: 200, data: processedData });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ code: 400, message: "Something went wrong" });
  } finally {
    await connection.release();
  }
}

async function processData(campaing: any, campaign_actions: any) {
  const result: any = [];
  campaing.forEach(async (campaign: any) => {
    const actions = await getActionRewardList(campaign_actions, campaign.id);
    result.push({ ...campaign, actions });
  });
  return result;
}

async function getActionRewardList(
  campaign_actions: RowDataPacket[],
  id: number
) {
  const result: any = [];
  campaign_actions.forEach((action) => {
    if (action.campaign_id == id) {
      result.push(action);
    }
  });
  return result;
}

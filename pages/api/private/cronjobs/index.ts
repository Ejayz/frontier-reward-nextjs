import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Get a database connection
  const connection = await instance.getConnection();

  // Ensure the request has a valid JWT token
  const auth = new Cookies(req, res).get("auth") || "";
  
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
  
    // Fetch all campaigns where end_date is over or equal to today's date
    const currentDate = new Date().toISOString().split("T")[0];
    console.log("current date", currentDate);
    const [campaignsResult] = await connection.query(
      `SELECT id FROM campaign WHERE is_exist=1 AND end_date <= ?`,
      [currentDate]
    );
  
    // Check if the result is an array of objects
    if (Array.isArray(campaignsResult) && campaignsResult.length > 0) {
      console.log("campaignsResult", campaignsResult);
      // Update the status to 'expired' for each campaign
      for (const campaignRow of campaignsResult as { id: number }[]) {
        const campaignId = campaignRow.id;
        await connection.query(
          `UPDATE campaign SET status='expired' WHERE id=?`,
          [campaignId]
        );
      }
    }
  
    // Respond with success status
    return res.status(200).json({
      code: 200,
      message: "Update Actions successfully",
    });
    
  } catch (error) {
    console.error(error);
  
    // Respond with an internal server error status
    return res.status(500).json({
      error: "Internal Server Error",
    });
  } finally {
    // Release the database connection in the finally block
    connection.release();
  }
  
}

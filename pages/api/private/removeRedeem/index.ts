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
    // Extract data from the request body
    const { id } = req.body;
    // Update the action in the database
    const [UpdateActionsResult, UpdateActionsFields] = await connection.query(
      `update redeem set is_exist=0, removed_at=current_timestamp() where id=? and is_exist=1`,
      [id]
    );
    // Respond with success status
    return res.status(200).json({
      code: 200,
      message: "Remove redeemable successfully",
    });
  } catch (error) {
    console.error(error);

    // Respond with an internal server error status
    return res.status(500).json({
      error: "Internal Server Error",
    });
  } finally {
    // Release the database connection in the finally block
    await connection.release();
  }
}

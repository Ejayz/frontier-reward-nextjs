import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  console.log(req.body)
  // Get a database connection
  const connection = await instance.getConnection();
  // Ensure the request has a valid JWT token
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    // Extract data from the request body
    const { id, name, description, cost, package_id, reward_id } =
      req.body;
    // Update the action in the database
    const [UpdateActionsResult, UpdateActionsFields] = <RowDataPacket[]>(
      await connection.query(
        `update redeem set name=? ,description=? ,point_cost=? , package_id=? ,reward_id=?,updated_at=current_timestamp() where id=? and is_exist=1`,
        [name, description, cost, package_id, reward_id, id]
      )
    );
    if (UpdateActionsResult.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "Not found" });
    }
    // Return the updated action
    return res.status(200).json({ code: 200, message: "Success" });
  } catch (error) {
    console.error(error);

    // Respond with an internal server error status
    return res.status(500).json({ code: 500, error: "Internal Server Error" });
  } finally {
    // Release the database connection in the finally block
    await connection.release();
  }
}

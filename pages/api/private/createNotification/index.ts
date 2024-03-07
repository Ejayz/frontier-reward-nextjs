import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Handle GET method logic if needed
    return res.status(200).json({ message: "GET method is allowed" });
  } else if (req.method === "POST") {
    // Handle POST method logic
    const connection = await instance.getConnection();
    const auth = new Cookies(req, res).get("auth") || "";

    try {
      const verify = jwt.verify(auth, JWT_SECRET);
      let current_user = 0;

      if (typeof verify === "string") {
        res.status(401).json({ code: 401, message: "Invalid token" });
      } else if (verify?.id) {
        current_user = verify.id;
      } else {
        res.status(401).json({ code: 401, message: "Invalid token format" });
      }

      console.log("current_user", current_user);

      const { notification_id } = req.body;

      const [results, fields] = <RowDataPacket[]>(
        await connection.query(
          `INSERT INTO notification_records (customer_id, notification_id) VALUES (?,?)`,
          [current_user, notification_id]
        )
      );

      if (results.affectedRows > 0) {
        res
          .status(201)
          .json({ code: 201, message: "Action created successfully" });
      } else {
        res
          .status(500)
          .json({ code: 500, message: "Something went wrong. Please try again" });
      }
    } catch (e: any) {
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({ code: 401, message: "Token Expired" });
      } else if (e.name === "JsonWebTokenError") {
        return res.status(401).json({ code: 401, message: "Invalid Token" });
      } else if (e.name === "NotBeforeError") {
        return res.status(401).json({ code: 401, message: "Token not active" });
      } else {
        return res.status(500).json({ code: 500, message: e.message });
      }
    } finally {
      await connection.release();
    }
  } else {
    // Handle other methods if needed
    return res.status(405).json({
      code: 405,
      message: "Invalid method. Only GET and POST methods are allowed",
    });
  }
}

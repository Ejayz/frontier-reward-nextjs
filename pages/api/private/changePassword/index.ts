import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  if (!req.body) {
    return res.status(400).json({ code: 400, message: "Bad request" });
  }
  const { password, token } = req.body;
  const connection = await instance.getConnection();

  try {
    const verify = jwt.verify(token, JWT_SECRET);
    console.log(verify);
    if (!verify) {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }
    if (typeof verify == "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [results, fields] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE users SET password=? where id=? and email=? and is_exist=1`,
        [hashedPassword, verify.user_id, verify.email]
      )
    );
    console.log(results);
    if (results.affectedRows == 0) {
      return res
        .status(400)
        .json({
          code: 400,
          message:
            "It seems that we cannot find your account . Please contact support.",
        });
    } else {
      return res
        .status(200)
        .json({ code: 200, message: "Password changed successfully" });
    }
  } catch (error: any) {
    console.log(error);
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token expired" });
    } else if (error.name == "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (error.name == "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Something went wrong.Please try again" });
    }
  } finally {
    await connection.release();
  }
}

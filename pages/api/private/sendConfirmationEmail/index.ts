import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Resend } from "resend";
import ConfirmEmail from "@/react-email-starter/emails/confirm-email";
import instance from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_SECRET = process.env.RESEND_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res).get("auth");

  if (cookies === undefined) {
    res.status(401).json({ code: 401, message: "Unauthorized" });
    return;
  }
  const user_token = jwt.decode(cookies);
  console.log(user_token);
  if (typeof user_token == "string") {
    return res.status(401).json({ code: 401, message: "Invalid Token" });
  }
  if (user_token?.exp && user_token?.exp > Date.now() / 1000) {
    return res.status(401).json({
      message:
        "A verification email was sent recently . Please check your email or spam folder. You can get another verification email when previous email expire.Verification email has 15 minutes validity. ",
    });
  }
  if (user_token?.token) {
    if (jwt.verify(user_token?.code || "", JWT_SECRET)) {
      return res.status(401).json({
        code: 401,
        message:
          "A verification email was sent recently . Please check your email or spam folder. You can get another verification email when previous email expire.Verification email has 15 minutes validity. ",
      });
    }
  }
  const connection = await instance.getConnection();
  const resend = new Resend(RESEND_SECRET);
  try {
    const verify = jwt.verify(cookies, JWT_SECRET);
    if (typeof verify == "string") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    }
    const [UserAccountResult, UserAccountFields] = <RowDataPacket[]>(
      await connection.query(
        `SELECT *,customer_info.first_name as CustomerFirstName,customer_info.last_name as CustomerLastName,employee_info.first_name as EmployeeFirstName,employee_info.last_name as EmployeeLastName FROM users LEFT JOIN employee_info ON employee_info.id= users.id LEFT JOIN customer_info ON customer_info.id=users.id LEFT JOIN user_type ON user_type.id =users.user_type WHERE users.id=? AND users.is_exist=1`,
        [verify.id]
      )
    );

    if (
      UserAccountResult[0].email_verified_at &&
      UserAccountResult[0].password_change_at !== null
    ) {
      return res
        .status(401)
        .json({ code: 401, message: "Email Already Verified" });
    }
    const currentTimestamp = Date.now() / 1000;
    const decoded = await jwt.decode(UserAccountResult[0].code);
    if (typeof decoded == "string") {
    } else if (decoded?.exp === undefined) {
    } else if (decoded?.exp > currentTimestamp) {
      return res.status(401).json({
        code: 401,
        message:
          "A verification email was sent recently . Please check your email or spam folder. You can get another verification email when previous email expire.Verification email has 15 minutes validity. ",
      });
    }
    const verification_token = jwt.sign(
      { id: verify.id, main_id: verify.main_id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const verification_link = `https://${req.headers.host}/verifying?token=${verification_token}`;

    const first_name =
      UserAccountResult[0].user_type !== 4
        ? UserAccountResult[0]?.EmployeeFirstName
        : UserAccountResult[0]?.CusomerFirstName;
    const last_name =
      UserAccountResult[0].user_type !== 4
        ? UserAccountResult[0]?.EmployeeLastName
        : UserAccountResult[0]?.CustomerLastName;
    const email = UserAccountResult[0]?.email || "";
    const [UpdateUserCodeResult, UpdateUserCodeFields] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE users SET code=? WHERE id=? and is_exist=1`,
        [verification_token, verify.id]
      )
    );

    const { data, error } = await resend.emails.send({
      from: "noreply@pointandperks <noreply@sledgehammerdevelopmentteam.uk>",
      to: [email],
      subject: "Confirm Email",
      react: ConfirmEmail({
        first_name: first_name,
        last_name: last_name,
        verification_link: verification_link,
      }),
    });

    if (error) {
      return res.status(500).json({ code: 500, message: error.message });
    } else {
      return res
        .status(200)
        .json({ code: 200, message: "Verification Email Sent" });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      return res.status(500).json({ code: 500, message: error.message });
    }
  } finally {
    await connection.release();
  }
}

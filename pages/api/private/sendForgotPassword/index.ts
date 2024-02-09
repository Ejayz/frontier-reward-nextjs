import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { Resend } from "resend";
import ForgotPassword from "@/react-email-starter/emails/forgot-password";
import instance from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_SECRET = process.env.RESEND_SECRET || "";
const DOMAIN_LINK = process.env.DOMAIN_LINK || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }

  const connection = await instance.getConnection();
  const resend = new Resend(RESEND_SECRET);

  try {
    const { email } = req.body;
    const [UsersAccountResult, UsersAccountFields] = <RowDataPacket[]>(
      await connection.query(
        `SELECT * FROM users WHERE email=? AND is_exist=1`,
        [email]
      )
    );
    console.log(UsersAccountResult);
    if (UsersAccountFields.length == 0) {
      return res
        .status(404)
        .json({ code: 404, message: "No user found with this email" });
    }
    const token = jwt.sign(
      {
        email: email,
        is_forgot_password: true,
        user_id: UsersAccountResult[0].id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const forgot_password_link = `${DOMAIN_LINK}changepassword?token=${token}`;
    if (!token) {
      return res.status(500).json({
        code: 500,
        message: "Something went wrong.Please try again later.",
      });
    }
    const [UpdateCodeResult, UpdateCodeFields] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE users SET code=? WHERE id=? and is_exist=1`,
        [token, UsersAccountResult[0].id]
      )
    );

    if (UpdateCodeResult.affectedRows == 0) {
      return res.status(500).json({
        code: 500,
        message: "Something went wrong.Please try again later.",
      });
    }

    const sendMail = await resend.emails.send({
      from: "ForgotPassword@PointsAndPerks <forgotpassword.noreply@pointsandperks.ca>",
      to: [UsersAccountResult[0].email],
      subject: "Forgot Password Request- Points and Perks",
      react: ForgotPassword({ forgot_password_link: forgot_password_link }),
    });
    if (!sendMail) {
      return res.status(500).json({
        code: 500,
        message: "Something went wrong while sending email.Please try again.",
      });
    } else {
      return res
        .status(200)
        .json({ code: 200, message: "Forgot password link sent successfully" });
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

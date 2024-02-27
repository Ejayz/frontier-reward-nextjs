import { NextApiRequest, NextApiResponse } from "next";
import instance from "../../db";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { RowDataPacket } from "mysql2";
import { Resend } from "resend";
import NewRedeem from "@/react-email-starter/emails/new-redeem-created";

import twilio from "twilio";
const RESEND_API = process.env.RESEND_SECRET || "";
dotenv.config();
const resend = new Resend(RESEND_API);
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(

  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({ code: 405, message: "Only POST requests allowed" });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
      console.log("Current user ID:", current_user);
    } else {
      return res
        .status(401)
        .json({ code: 401, message: "Invalid token format" });
    }
    const { user_email, user_phonenumber } = req.body;

    const [usersData]=<RowDataPacket[]>(await connection.query("SELECT * FROM users WHERE is_exist=? && user_type=?", [1,4]));

    if (usersData.length === 0) {
      console.log("No users found with is_exist = 1");
    } else {
      console.log("Users data:");
      usersData.forEach((user:any) => {
        const { email, phone_number} = user;
        //console.log("User email:", email);
        //console.log("User phonenumber:", phone_number);
        //console.log("--------"); // Separate each user for better readability
        const base_url = `https://${req.headers.host}/`;
        const data = resend.emails.send({
          from: "Register@PointsAndPerks <register.noreply@pointsandperks.ca>",
          to: [email], // Use the user's email
          subject: "Welcome to Perks and Points",
          react: NewRedeem({
            email,
            base_url,
          }),
          text: `Welcome to Perks and Points!`,
        });
        const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const body = "Ice creams are coming!";
        const numbers = [phone_number];
        const service = twilio.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);
        const bindings = numbers.map(number => {
          return JSON.stringify({ binding_type: 'sms', address: number });
        });
        service.notifications
          .create({
                toBinding: bindings,
                body: body
          })
          .then((notification:any) => {
                console.log("notification sent successfully");
          })
          .catch((err:any) => {
                console.error("notification failed to send");
          });
      });
    }

    const { name, description, cost, package_id, reward_id } = req.body;

    const [rows] = <RowDataPacket[]>(
      await connection.query(
        "INSERT INTO redeem (name, description, point_cost, package_id, reward_id,employee_id) VALUES (?, ?, ?, ?, ?,?)",
        [name, description, cost, package_id, reward_id, current_user]
      )
    );
    if (rows.affectedRows === 0) {
      return res.status(400).json({ code: 400, message: "Bad Request" });
    }
   
    return res
      .status(200)
      .json({ code: 200, message: "New redeemable added.",});
      
  } catch (error: any) {
    console.log(error);
    if (error.message === "jwt expired") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    return res
      .status(500)
      .json({ code: 500, message: "Internal Server Error" });
  } finally {
    await connection.release();
  }
}

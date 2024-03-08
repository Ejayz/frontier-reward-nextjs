// pages/api/actions.js
import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import instance from "../../db";
import { Resend } from "resend";
import { RowDataPacket } from "mysql2";
import NewCampaign from "@/react-email-starter/emails/new-campaign-created";
const RESEND_API = process.env.RESEND_SECRET || "";
dotenv.config();
const resend = new Resend(RESEND_API);
const JWT_SECRET = process.env.JWT_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
    const auth = new Cookies(req, res).get("auth") || "";
  const verify = jwt.verify(auth, JWT_SECRET);
  const connection = await instance.getConnection();
    let current_user = 0;
    if (typeof verify === "string") {
      res.status(401).json({ code:401,message: "Invalid token" });
    } else if (verify?.main_id) {
      current_user = verify.main_id;
    
    } else {
      res.status(401).json({ code:401,message: "Invalid token format" })
    }
    const [usersData] = <RowDataPacket[]>(await connection.query("SELECT * FROM users WHERE is_exist=? && user_type=? && email_verified_at IS NOT NULL && code IS NOT NULL", [1, 4]));
    if (usersData.length === 0) {
      console.log("No users found with is_exist = 1");
    } else {
      console.log("Users data:");
      usersData.forEach((user:any) => {
        const { email, phone_number } = user;
        console.log("User email:", email);
        console.log("User phonenumber:", phone_number);
        console.log("--------"); // Separate each user for better readability
        const base_url = `https://${req.headers.host}/`;
        const data = resend.emails.send({
          from: "New Campaig @PointsAndPerks <register.noreply@pointsandperks.ca>",
          to: [email], // Use the user's email
          subject: "Welcome to Perks and Points",
          react: NewCampaign({
            email,
            base_url,
          }),
          text: `Welcome to Perks and Points!`,
        });
      
        const twilio = require('twilio')(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
      
        const body ='Dear Customers,\n\nWe\'re delighted to inform you that a new campaign has been created for your benefit. 🌟 Kindly explore and redeem exclusive offers on our app.'
        +'\n\nBest regards,\nPointsAndPerks Team';
        const numbers = [phone_number]; // Convert to array even if there's only one number
      
        const service = twilio.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);
      
        const bindings = numbers.map((number: string) => {
          return JSON.stringify({ binding_type: 'sms', address: number });
        });
      
        service.notifications
          .create({
            toBinding: bindings,
            body: body
          })
          .then((notification: any) => {
            console.log(notification);
          })
          .catch((err: any) => {
            console.error(err);
          });
      });
    }
    const { name, description,start_date,end_date,status, package_id,employee_id, is_exist } = req.body;
    try {
      const [results,fields] =<RowDataPacket[]> await connection.query(`INSERT INTO campaign (name,description,start_date,end_date,status,package_id,employee_id,is_exist) VALUES (?,?,?,?,?,?,?,?)`
      , [name,description,new Date(start_date).toISOString().slice(0, 19).replace('T', ' '),new Date(end_date).toISOString().slice(0, 19).replace('T', ' '),"active",package_id,current_user,1])
        if(results.affectedRows>0){
            res.status(201).json({code:201,message:"Campaign created successfully"});
        }else{
            res.status(500).json({code:500,message:"Something went wrong.Please try again"});
        }
        let campaign_id = results.insertId;
   
        const [rowsnotif] = <RowDataPacket[]>(
          await connection.query(
            "INSERT INTO notification (campaign_id) VALUES (?)  ",
            [campaign_id]
          )
        );
        if (rowsnotif.affectedRows === 0) {
          return res.status(400).json({ code: 400, message: "Bad Request" });
        }

    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally{
      await connection.release()
    }
 

 
}

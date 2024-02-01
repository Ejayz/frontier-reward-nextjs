import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as generator from "generate-password";
import { Resend } from "resend";
import AccountCreation from "@/react-email-starter/emails/account-creation";
import instance from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_API = process.env.RESEND_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (!req.body) {
    return res.status(400).json({ message: "No body provided" });
  }
  const connection = await instance.getConnection();
  const resend = new Resend(RESEND_API);
  const {
    first_name,
    middle_name,
    last_name,
    suffix,
    phone_number,
    email,
    employee_type,
  } = req.body;
  const auth = new Cookies(req, res).get("auth") || "";
  const password = generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
  });
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    const transaction = await connection.beginTransaction();
    const [checkEmailResult,checkEmailFields]= <RowDataPacket[]>await connection.query(`SELECT * FROM users WHERE email=? AND is_exist=1`,[email]);
    
      if (checkEmailResult.length > 0) {
        return res.status(400).json({ message: "Email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const [createUserResult,createUserFields]=<RowDataPacket[]>await connection.query(`INSERT INTO users (email,phone_number,password,is_exist,user_type) VALUES (?,?,?,?,?)`,
      [email,phone_number,hash,1,parseInt(employee_type)]);
      if(createUserResult.affectedRows==0){
        await connection.rollback();
        return res.status(400).json({ message: "Something went wrong" });
      }

      const [createEmployeeInfoResult,createEmployeeInfoFields]=<RowDataPacket[]>await connection.query(`INSERT INTO employee_info (first_name,middle_name,last_name,suffix,user_id) VALUES (?,?,?,?,?)`,
      [first_name,middle_name,last_name,suffix==""?"N/A":suffix,createUserResult.insertId]);
      if(createEmployeeInfoResult.affectedRows==0){
        await connection.rollback();
        return res.status(400).json({ message: "Something went wrong" });
      }
      const base_url=`https://${req.headers.host}/`
    const data=await resend.emails.send({
      from: "Register@PointsAndPerks <register.noreply@sledgehammerdevelopmentteam.uk>",
      to: [email],
      subject: "Welcome to Perks and Points",
      react: AccountCreation({
        first_name: first_name ,
        last_name: last_name,
        password: password,
        email: email,
        base_url: base_url,
      }),
      text: `Welcome to Perks and Points!`,
    });
    
    if(data){
      await connection.commit();
      return res.status(200).json({
        code: 200,
        message:
          "Kindly remind the newly created account holder to check their email for login credentials.",
      });
    }else{
      return res.status(400).json({
        code: 400,
        message:
          "Something went wrong. Please try again later.",
      });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  } finally {
    await connection.release();
  }
}

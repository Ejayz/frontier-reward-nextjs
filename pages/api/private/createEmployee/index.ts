import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import * as generator from "generate-password";
import { Resend } from "resend";
import AccountCreation from "@/react-email-starter/emails/account-creation";

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
  const prisma = new PrismaClient();
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
  console.log( first_name,
    middle_name,
    last_name,
    suffix,
    phone_number,
    email,
    employee_type,)
  const auth = new Cookies(req, res).get("auth") || "";
  const password = generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: true,
  });
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    const transaction = await prisma.$transaction(async (tx: any) => {
      const checkEmail = await tx.users.findMany({
        where: {
          email: email,
          is_exist: 1,
        },
      });
      if (checkEmail.length > 0) {
        return res.status(400).json({ message: "Email already exist" });
      }
   

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const createUser= await tx.users.create({
        data:{
          email:email,
          phone_number:phone_number,
          password:hash,
          is_exist:1,
          user_type:parseInt(employee_type),
        }
      })
      const createEmployeeInfo = await tx.employee_info.create({
        data: {
          first_name: first_name,
          middle_name: middle_name,
          last_name: last_name,
          suffix: suffix==""?"N/A":suffix,
          user_id: createUser.id,
        },
      });
    });
    const data=await resend.emails.send({
      from: "Register@PointsAndPerks <register.noreply@sledgehammerdevelopmentteam.uk>",
      to: [email],
      subject: "Welcome to Perks and Points",
      react: AccountCreation({
        first_name: first_name ,
        last_name: last_name,
        password: password,
        email: email,
        base_url: "https://perksandpoints.com/",
      }),
      text: `Welcome to Perks and Points!`,
    });
    
    if(data){
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
    await prisma.$disconnect();
  }
}

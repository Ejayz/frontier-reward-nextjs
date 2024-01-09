import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Resend } from "resend";
import ConfirmEmail from "@/react-email-starter/emails/confirm-email";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_SECRET=process.env.RESEND_SECRET||""
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res).get("auth");
  
  if (cookies === undefined) {
    res.status(401).json({ code: 401, message: "Unauthorized" });
    return;
  }
  const user_token=jwt.decode(cookies)
  if(typeof user_token=="string"){
    return res.status(401).json({ message: "Invalid Token" });
  }

if(user_token?.token){
  if(jwt.verify(user_token?.code || "",JWT_SECRET)){
    return res.status(401).json({ message: "A verification email was sent recently . Please check your email or spam folder. You can get another verification email when previous email expire.Verification email has 15 minutes validity. " });
  }
}
  const prisma = new PrismaClient();
  const resend=new Resend(RESEND_SECRET)
  try {
    const verify = jwt.verify(cookies, JWT_SECRET);
    if(typeof verify == "string"){
      return res.status(401).json({ message: "Invalid Token" });
    }
    
  const user_account=await  prisma.users.findFirst({
      where:{
        id:verify.id
      },include:{
        employee_info:true,
        customer_info:true,
        user_type_users_user_typeTouser_type:true,
      }
    })

    if(user_account?.email_verified_at){
      return res.status(401).json({ message: "Email Already Verified" });
    }


const verification_token=jwt.sign({id:verify.id,main_id:verify.main_id},JWT_SECRET,{expiresIn:"15m"})
const verification_link=`https://${req.headers.host}/verifying?token=${verification_token}`

const first_name=user_account?.user_type_users_user_typeTouser_type.id!==4?user_account?.employee_info[0].first_name:user_account?.customer_info[0].first_name
const last_name=user_account?.user_type_users_user_typeTouser_type.id!==4 ?user_account?.employee_info[0].last_name:user_account?.customer_info[0].last_name
const email=user_account?.email || ""

const transactionResult=await prisma.$transaction(async (tx)=>{
  const insertVerificationLink=await tx.users.update({
  where :{
    id:verify.id
  },
  data:{
    code:verification_token
  }
})

})

    const {data,error}=await resend.emails.send({
      from:"noreply@pointandperks <noreply@sledgehammerdevelopmentteam.uk>",
      to:[email],
      subject:"Confirm Email",
      react:ConfirmEmail({
        first_name:first_name,
        last_name:last_name,
        verification_link:verification_link,
    
      })
    })
    console.log(data)
    if(error){
      return res.status(500).json({ message: error.message });
    }
    else
    {
      return res.status(200).json({ message: "Verification Email Sent" });
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

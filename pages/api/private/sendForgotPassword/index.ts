import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { Prisma, PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import ForgotPassword from "@/react-email-starter/emails/forgot-password";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET||"";
const RESEND_SECRET=process.env.RESEND_SECRET||"";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
 if(req.method !="POST"){
        return res.status(405).json({code:405,message:"Method not allowed"})
 }
 const prisma=new PrismaClient();
 const resend = new Resend(process.env.RESEND_SECRET);

try{
    const {email}=req.body
const transaction=await prisma.$transaction(async (tx:any)=>{
    const user=await tx.users.findFirst({where:{email:email,is_exist:1}})
    console.log(user)
    if(user.length==0){
        return res.status(404).json({code:404,message:"No user found with this email"})
    }
    const token=jwt.sign({email:email,is_forgot_password:true,user_id:user.id},JWT_SECRET,{expiresIn:"1h"})
    const forgot_password_link=`https://${req.headers.host}/changepassword?token=${token}`
    console.log(token)
    if(!token){
        return res.status(500).json({code:500,message:"Something went wrong.Please try again later."})
    }
    const insertCode=await tx.users.update({
        where:{
            id:user.id
        },
        data:{
            code:token
        }
    })
    if(!insertCode){
        return res.status(500).json({code:500,message:"Something went wrong.Please try again later."})
    }
   console.log(user.email)
    const sendMail=await resend.emails.send({
        from: "ForgotPassword@PointsAndPerks <forgotpassword.noreply@sledgehammerdevelopmentteam.uk>",
        to: [user.email],
        subject: "Forgot Password Request- Points and Perks",
        react:ForgotPassword({forgot_password_link:forgot_password_link})
        });

        if(!sendMail){
            return res.status(500).json({code:500,message:"Something went wrong while sending email.Please try again."})
        }
        console.log(sendMail)
        return res.status(200).json({code:200,message:"Forgot password link sent successfully"})
        
}
)
}catch(error:any){
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ code: 401, message: "Token Expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ code: 401, message: "Invalid Token" });
      } else if (error.name === "NotBeforeError") {
        return res.status(401).json({ code: 401, message: "Token not active" });
      } else {
        return res.status(500).json({ code: 500, message: error.message });
      }
}finally{
    prisma.$disconnect();
}


}
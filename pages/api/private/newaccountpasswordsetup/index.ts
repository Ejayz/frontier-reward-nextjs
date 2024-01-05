import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";   
import Cookies from "cookies";
dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET || "";
export default async function hander ( req:NextApiRequest , res:NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({code:405 , message:"Method not allowed"})
    }
    const {password}=req.body;
    const auth=new Cookies(req,res).get("auth")||"";
    const prisma = new PrismaClient();
        
    try{
        const verify=jwt.verify(auth,JWT_SECRET);
        if(!verify){
            return res.status(401).json({code:401 , message:"Invalid Token"})
        }

        if(typeof verify=="string"){
            return res.status(401).json({code:401 , message:"Invalid Token"})
        }
        console.log(verify.password_change_at)
        if(verify.password_change_at == null || verify.password_change_at ==true || verify.password_change_at == undefined){
            return res.status(401).json({code:401 , message:"It seems that your account is already been setup with new password. Please login with your new password."})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatePassword=await prisma.users.update({
            where:{
                id:verify.id
            },
            data:{
                password:hashedPassword,
                password_change_at:new Date()
            }
        })
        if(!updatePassword){
            console.log("error")
            return res.status(500).json({code:500 , message:"Internal Server Error"})
        }
         else{
            return res.status(200).json({code:200 , message:"Password Updated Successfully. Please login again with your new password."})
         }

    }catch(errors:any){
        console.log(errors)
            if(errors.name=="TokenExpiredError"){
                return res.status(401).json({code:401 , message:"Token Expired"})
            }
            else if(errors.name=="JsonWebTokenError"){
                return res.status(401).json({code:401 , message:"Invalid Token"})
            }
            else if(errors.name=="NotBeforeError"){
                return res.status(401).json({code:401 , message:"Token not yet valid"})
            }else{
                return res.status(500).json({code:500 , message:"Server error. Please try again later"})
            }
    } finally
     {
        prisma.$disconnect();
     }

}
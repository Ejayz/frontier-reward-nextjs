import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET || "";
export default async function hander ( req:NextApiRequest , res:NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({code:405 , message:"Method not allowed"})
    }
    const {password}=req.body;

    const prisma = new PrismaClient();
    try{
        const verify=jwt.verify(password, || "");
    }catch(errors:any){
        
    }

}
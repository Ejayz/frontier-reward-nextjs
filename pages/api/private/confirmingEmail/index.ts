import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET||""

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const {token}=req.body
  const prisma=new PrismaClient()

  try{
    const verify=jwt.verify(token,JWT_SECRET)
    if(typeof verify=="string"){
      return res.status(401).json({message:"Invalid Token"})
    }
    const updateAccount = await prisma.users.update({
        where: {
            id: verify.id,
        },
        data: {
            email_verified_at: new Date(),
        },
        });
        if (!updateAccount) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        else{
            return res.status(200).json({message:"Email Verified"})
        }
  }catch(error:any)
{
    if(error.name==="TokenExpiredError"){
      return res.status(401).json({message:"Token Expired"})
    }
    else if(error.name==="JsonWebTokenError"){
      return res.status(401).json({message:"Invalid Token"})
    }
    else if (error.name==="NotBeforeError"){
      return res.status(401).json({message:"Token Not Active"})
    }
    else{
      return res.status(500).json({message:"Internal Server Error"})
    }
}
finally{
  await prisma.$disconnect()
}

}

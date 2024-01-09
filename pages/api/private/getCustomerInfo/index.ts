import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import { Prisma, PrismaClient } from "@prisma/client";

dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET||"";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if(req.method !== "GET"){
        return res.status(405).json({code:405,message:"Method not allowed"})
    }
    const prisma=new PrismaClient({
        log:["query"],
    });
    const auth=new Cookies(req,res).get("auth")||"";
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    if(req.query.user_id==undefined){
        return res.status(400).json({code:400,message:"User id is required"})
    }

    try{
        const user_id=req.query.user_id||0;
        if(typeof user_id !== "string"){
            return res.status(400).json({code:400,message:"User id must be a string"})
        }
        const customer=await prisma.customer_info.findUnique({
            where:{
                id:parseInt(user_id) || 0
            },
            include:{
                customer_address:true,
                packages:true,
                users:true,
                customer_vehicle_info:true,
            }
        })
        const vehicles=await prisma.$queryRaw(Prisma.sql`SELECT *,vin_id as vin_no, id as table_uuid FROM customer_vehicle_info WHERE customer_info_id=${user_id} and is_exist=1`)
        console.log(vehicles)
        if(customer==null){
            return res.status(404).json({code:404,message:"Customer not found"})
        }

       return res.status(200).json({code:200,message:"Success",data:customer,vehicles:vehicles})
    }catch(error:any){
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ code: 401, message: "jwt expired" });
          } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ code: 401, message: "jwt malformed" });
          } else if (error.name === "NotBeforeError") {
            return res.status(401).json({ code: 401, message: "jwt not active" });
          } else {
            return res
              .status(401)
              .json({ code: 401, message: "User is not authenticated" });
          }
    }
finally{
   prisma.$disconnect();
}

}

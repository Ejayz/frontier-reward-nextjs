import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
dotenv.config();

interface CustomCustomerInfoWhereInput extends Prisma.customer_infoWhereInput {
    email?: Prisma.StringFilter;
  }

const JWT_SECRET=process.env.JWT_SECRET || "";

export default async function handler(
req: NextApiRequest,
res: NextApiResponse
) {
if (req.method !== "GET") {
return res.status(405).json({code:405, message: "Method not allowed" });
}
const {search,page} = req.query
const prisma = new PrismaClient();
const  auth=new Cookies(req,res).get("auth") || "";

try {
const verify = jwt.verify(auth, JWT_SECRET);
if (typeof verify === "string") {
return res.status(401).json({code:401, message: "User is not authenticated" });
}


const getUsers = await prisma.$queryRaw`SELECT * FROM customer_info LEFT JOIN users ON customer_info.user_id = users.id  LEFT JOIN user_type ON users.user_type = user_type.id LEFT JOIN customer_address ON customer_info.address_id = customer_address.id `;
console.log(getUsers)

return res.status(200).json({code:200, message: "Success", data: getUsers });

}
catch (error:any) {
    if(error.name==="TokenExpiredError"){
        return res.status(401).json({code:401, message: "jwt expired" });
    }else if(error.name==="JsonWebTokenError"){
        return res.status(401).json({code:401, message: "jwt malformed" });
    }else if(error.name==="NotBeforeError"){
        return res.status(401).json({code:401, message: "jwt not active" });
    }
    else{
        return res.status(500).json({code:500, message: "Internal Server Error" })
    }
}
finally{
    prisma.$disconnect
}

}


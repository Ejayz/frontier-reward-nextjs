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
if (req.method !== "POST") {
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


const getUsers = await prisma.customer_info.findMany({
    where: {
      is_exist: 1,
      OR: [
        {
          first_name: {
            contains: search as string,
          },
        },
        {
          last_name: {
            contains: search as string,
          },
        },
        {
          middle_name: {
            contains: search as string,
          },
        },
        {
          suffix: {
            contains: search as string,
          },
        },
        // Add the email filter using the extended type
        {
          email: {
            contains: search as string,
          },
        },
      ],
    },
    include: {
      users: {
        include: {
          user_type_users_user_typeTouser_type: true,
        },
      },
      customer_address: true,
      Renamedpackage: true,
      employee_info: true,
      redeem_transaction: true,
    },
  });



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


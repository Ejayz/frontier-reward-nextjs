import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method Not Allowed" });
  }
  console.log(req.body);
  const { token } = req.body;

  const prisma = new PrismaClient();
  try {
    const verify = jwt.verify(token, JWT_SECRET);
    if (typeof verify == "string") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
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
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    } else {
      const user = await prisma.users.findFirst({
        where: { id: verify.id, is_exist: 1 },
        include: {
          user_type_users_user_typeTouser_type: true,
          customer_info: true,
          employee_info: true,
        },
      });
      console.log(user)
      let token;
      if(user?.code=="(NULL)"  || user?.code==undefined || user?.code==null){
        token=jwt.sign(
          {
            id: user?.id,
            role: user?.user_type,
            role_name: user?.user_type_users_user_typeTouser_type.name,
            main_id:
              user?.employee_info.length||0 > 0
                ? user?.employee_info[0].id
                : user?.customer_info[0].id,
            is_employee: user?.employee_info.length ||0> 0 ? true : false,
            is_email_verified: user?.email_verified_at ? true : false,
            code:user?.code
          },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        )
   }else if( user.password_change_at==undefined || user.password_change_at==null){
     token=jwt.sign(
        {
          id: user.id,
          role: user.user_type,
          role_name: user.user_type_users_user_typeTouser_type.name,
          main_id:
            user.employee_info.length > 0
              ? user.employee_info[0].id
              : user.customer_info[0].id,
          is_employee: user.employee_info.length > 0 ? true : false,
          is_email_verified: user.email_verified_at ? true : false,
          code:user.code,
          password_change_at:false
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      )
      }else{
      
        token=jwt.sign(
          {
            id: user.id,
            role: user.user_type,
            role_name: user.user_type_users_user_typeTouser_type.name,
            main_id:
              user.employee_info.length > 0
                ? user.employee_info[0].id
                : user.customer_info[0].id,
            is_employee: user.employee_info.length > 0 ? true : false,
            is_email_verified: user.email_verified_at ? true : false,
          },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        )
      }
      console.log(token)
      return res
      .setHeader("Set-Cookie", `auth=${token};path=/;max-age=3600;"`)
        .status(200)
        .json({ code: 200, message: "Email Verified","passwordToken":token });
    }
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token Not Active" });
    } else {
      return res
        .status(500)
        .json({ code: 401, message: "Internal Server Error" });
    }
  } finally {
    await prisma.$disconnect();
  }
}

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
dotenv.config();
const jwt_secret = process.env.JWT_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  let  token;



  if (req.method !== "POST") {
    res.status(405).json({ code: 405, message: "Method not allowed" });
    return;
  }
  if (req.body.email === "" || req.body.password === "") {
    res
      .status(400)
      .json({ code: 400, message: "Email and password are required" });
    return;
  }
  const { email, password } = req.body;
  console.log(email, password);
  const prisma = new PrismaClient();
  try {
    const user = await prisma.users.findFirst({
      where: { email: email, is_exist: 1 },
      include: {
        user_type_users_user_typeTouser_type: true,
        customer_info: true,
        employee_info: true,
      },
    });
    console.log(user);
    if (!user) {
      res.status(404).json({ code: 404, message: "Invalid credentials used." });
      return;
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(401).json({ code: 401, message: "Invalid credentials used." });
      return;
    }
    if(user.code=="(NULL)"  || user.code==undefined || user.code==null){
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
          code:user.code
        },
        jwt_secret,
        {
          expiresIn: "1h",
        }
      )
 }else if( user.password_change_at!=undefined || user.password_change_at!=null){
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

      },
      jwt_secret,
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
        jwt_secret,
        {
          expiresIn: "1h",
        }
      )
    }
   
    res
      .setHeader("Set-Cookie", `auth=${token};path=/;max-age=3600;"`)
      .status(200)
      .json({
        code: 200,
        message: "Login successful",
        token: {
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
      });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

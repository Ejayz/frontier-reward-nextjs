import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import { Console } from "console";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  if (!req.body) {
    return res.status(400).json({ code: 400, message: "Bad request" });
  }
  const { password, token } = req.body;

  const prisma = new PrismaClient();

  try {
    const verify = jwt.verify(token, JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }
    if(typeof verify=="string"){
        return res.status(401).json({ code: 401, message: "Invalid token" });
        }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatePassword = await prisma.users.update({
      where: {
        id: verify.user_id,
        is_exist: 1,

      },
      data: {
        password: hashedPassword,
      },
    });
    if (!updatePassword) {
      return res
        .status(500)
        .json({ code: 500, message: "Something went wrong.Please try again" });
    }
    else{
        return res.status(200).json({code:200,message:"Password changed successfully"})
    }

  } catch (error: any) {
    if (error.name == "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token expired" });
    } else if (error.name == "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (error.name == "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    }
  } finally {
    prisma.$disconnect();
  }
}

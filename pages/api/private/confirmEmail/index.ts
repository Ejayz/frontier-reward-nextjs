import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res).get("auth");

  if (cookies === undefined) {
    res.status(401).json({ code: 401, message: "Unauthorized" });
    return;
  }
  const prisma = new PrismaClient();
  try {
    const verify = jwt.verify(cookies, JWT_SECRET);
    if(typeof verify == "string"){
      return res.status(401).json({ message: "Invalid Token" });
    }
    
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
}

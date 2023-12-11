import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (!req.body) {
    return res.status(400).json({ message: "No body provided" });
  }
  const prisma = new PrismaClient();
  const auth = new Cookies(req, res).get("auth") || "";

  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      packageId,
      middleName,
      vehicles,
    } = req.body;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } finally {
    await prisma.$disconnect();
  }
}

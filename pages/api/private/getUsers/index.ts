import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  if (req.query.page) {
    return res.status(400).json({ code: 400, message: "No page provided" });
  }
  const pages: number = parseInt(req.query.page as string) || 1;
  const skip = (pages - 1) * 7;
  const take = 7;
  try {
    const auth = new Cookies(req, res).get("auth") || "";
    const verify = jwt.verify(auth, JWT_SECRET);
    const users = await prisma.users.findMany({
      include: {
        user_types: true,
      },
      where: {
        is_exsit: true,
        NOT: {
          id: typeof verify == "string" ? 0 : verify.id,
        },
      },

      skip: skip,
      take: take,
      orderBy: {
        id: "desc",
      },
    });
    console.log(users);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      return res.status(500).json({ code: 500, message: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import Cookies from "cookies";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = new Cookies(req, res).get("auth") || "";

  try {
    const verify = await jwt.verify(auth, JWT_SECRET);
    const packagesList = await prisma.packages.findMany({
      where: { is_exist: 1 },
      select: {
        id: true,
        name: true,
      },
    });
    const modifiedPackagesList = packagesList.map((packages) => ({
      value: packages.id,
      text: packages.name,
    }));

    return res.status(200).json({ data: modifiedPackagesList });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    } else if (err.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } finally {
    await prisma.$disconnect();
  }
}

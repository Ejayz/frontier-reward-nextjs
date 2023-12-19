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
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }
  const { email, password } = req.body;
  const prisma = new PrismaClient();
  try {
    const user = await prisma.users.findFirst({
      where: { email },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid credentials used." });
      return;
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      res.status(401).json({ message: "Invalid credentials used." });
      return;
    }
    const token = jwt.sign(
      { id: user.id, role: user.user_type_id },
      jwt_secret,
      {
        expiresIn: "1h",
      }
    );
    res
      .setHeader("Set-Cookie", `auth=${token};path=/;max-age=3600;"`)
      .status(200)
      .json({ message: "Login successful" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
}

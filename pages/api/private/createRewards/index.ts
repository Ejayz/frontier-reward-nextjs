// pages/api/actions.js

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_API = process.env.RESEND_SECRET || "";
const BASE_URL = process.env.BASE_URL || "";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const auth = new Cookies(req, res).get("auth") || "";
  const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      // Handle the case where verify is a string (no access to id)
      console.log("User is not authenticated");
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
      console.log("Current user ID:" ,current_user);
    } else {
      // Handle any other unexpected verification result
      console.error("Invalid token format");
    }
    const { name, description, quantity, reward_type, employee_id, created_at, updated_at,removed_at, is_exist } = req.body;
    try {
      const createRewards = await prisma.reward.create({
        data: {
          name,
          description,
          quantity,
          reward_type,
          employee_id : current_user,
          created_at,
          updated_at,
          removed_at,
          is_exist: 1,

        },
      });

      res.status(201).json(createRewards);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }

  await prisma.$disconnect();
}

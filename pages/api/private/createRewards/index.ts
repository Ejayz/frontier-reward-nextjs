// pages/api/actions.js

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, description, type, cost, created_at, updated_at,quantity,points, percentage } = req.body;
    try {
      const createRewards = await prisma.rewards.create({
        data: {
          name,
          description,
          type,
          cost,
          quantity,
          points,
          percentage,
          created_at,
          updated_at,
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

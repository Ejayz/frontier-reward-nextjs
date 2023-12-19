// pages/api/actions.js

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, description, created_at, updated_at } = req.body;
    try {
      const createAction = await prisma.actions.create({
        data: {
          name,
          description,
          created_at,
          updated_at,
        },
      });

      res.status(201).json(createAction);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }

  await prisma.$disconnect();
}

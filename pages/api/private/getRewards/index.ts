import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      code: 405,
      message: "Invalid method. This endpoint only accept GET method",
    });
  }
  const prisma = new PrismaClient();

  try {
    const reqQuery = parseInt(req.query.page as string) || 1;
    const skip = (reqQuery - 1) * 10;
    const take = 10;
    const transactions = await prisma.rewards.findMany({
      where: {
        is_exist: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        cost: true,
        quantity: true,
        points: true,
        percentage: true,
      },
      skip: skip,
      take: take,
      orderBy: {
        id: "desc",
      },
    });
    console.log(transactions);
    return res.status(200).json({ code: 200, data: transactions });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ code: 400, message: "Something went wrong" });
  } finally {
    prisma.$disconnect();
  }
}

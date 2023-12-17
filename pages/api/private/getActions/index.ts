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
    const transactions = await prisma.actions.findMany()
    console.log("prisma", transactions);//display all data in console
    return res.status(200).json({ code: 200, data: transactions });
  } catch (e) {
    console.log(e)
    return res.status(400).json({ code: 400, message: "Something went wrong" });
  } finally {
    prisma.$disconnect();
  }
}
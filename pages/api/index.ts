import { NextApiRequest, NextApiResponse } from "next";

export default function hander(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ text: "Hello" });
}

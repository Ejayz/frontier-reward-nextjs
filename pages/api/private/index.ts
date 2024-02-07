import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req)
  res.status(401).json({
    status: "401",
    message:
      "This is a private API for allowed IPs only . Use the public API instead /api/public",
  });
}

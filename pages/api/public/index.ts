import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req)
  res
    .status(200)
    .json({
      status: 200,
      message: "This is a public API . For documentation please check <",
    });
    
}

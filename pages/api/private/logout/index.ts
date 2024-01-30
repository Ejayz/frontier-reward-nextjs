import { cookies } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import Cookies from "cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const auth = await Cookies(req, res).get("auth") || "";
  console.log(auth)
  console.log( serialize("auth",auth , {
    path: "/",
    maxAge: 0,
    expires: new Date(`1997-01-30T18:04:40.049Z`),
  }))
  return res
    .setHeader(
      "Set-Cookie",
      serialize("auth",auth , {
        path: "/",
        maxAge: 0,
        expires: new Date(`1997-01-30T18:04:40.049Z`),
      })
    )
    .status(200)
    .json({ code: 200, message: "Logout Successfully!" });
}

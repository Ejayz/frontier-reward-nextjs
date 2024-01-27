import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
      console.log("Current user ID:", current_user);
    } else {
      return res
        .status(401)
        .json({ code: 401, message: "Invalid token format" });
    }

    const {
      name,
      description,
      multiplier,
      created_at,
      is_exist,
    } = req.body;
    const [createPackageResult, createPackageFields] = <RowDataPacket[]>(
      await connection.query(
        `INSERT INTO packages (name,description,multiplier,is_exist) VALUES (?,?,?,?)`,
        [name,description,multiplier,1]
      )
    );
    if (createPackageResult.affectedRows == 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Something went wrong" });
    }
    if (createPackageResult.affectedRows > 0) {
      return res.status(200).json({ message: "Package created successfully" });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    await connection.release();
  }
}

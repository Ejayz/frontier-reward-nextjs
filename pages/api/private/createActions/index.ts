import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import Connection from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await Connection.getConnection();
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      // Handle the case where verify is a string (no access to id)
      res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
    } else {
      res.status(401).json({ code: 401, message: "Invalid token format" });
    }

    const {
      name,
      description,
      created_at,
      updated_at,
      removed_at,
      employee_id,
      is_exist,
    } = req.body;

    const [results, fields] = <RowDataPacket[]>(
      await connection.query(
        `INSERT INTO actions (name,description,employee_id,is_exist) VALUES (?,?,?,?)`,
        [name, description, created_at, updated_at, removed_at, current_user, 1]
      )
    );

    if (fields.affectedRows > 0) {
      res
        .status(201)
        .json({ code: 201, message: "Action created successfully" });
    } else {
      res
        .status(500)
        .json({ code: 500, message: "Something went wrong.Please try again" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
  finally{
    Connection.releaseConnection(connection);
  }
}

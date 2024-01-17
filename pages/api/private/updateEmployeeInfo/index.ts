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
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  const {
    first_name,
    middle_name,
    last_name,
    email,
    phone_number,
    employee_type,
    suffix,
    User_Id,
    CoreId,
  } = req.body;
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    }
    const transaction = await connection.beginTransaction();
    const [SelectUserResult] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM users where email=? and is_exist=1 and id!=?`,
      [email, User_Id]
    );
    if (SelectUserResult.length > 0) {
      connection.rollback();
      return res
        .status(409)
        .json({ code: 409, message: "Email already exist" });
    }
    const [UpdateUserResult] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE users SET email=?, phone_number=? WHERE id=?`,
        [email, phone_number, User_Id]
      )
    );
    if (UpdateUserResult.affectedRows === 0) {
      connection.rollback();
      return res
        .status(500)
        .json({ code: 500, message: "Unable to update users details." });
    }
    const [UpdateEmployeeResult] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE employee_info SET first_name=?, middle_name=?, last_name=?, suffix=? WHERE id=? `,
        [first_name, middle_name, last_name, suffix, CoreId]
      )
    );
    console.log(first_name, middle_name, last_name, suffix, CoreId)
    if (UpdateEmployeeResult.affectedRows === 0) {
      connection.rollback();
      return res
        .status(500)
        .json({ code: 500, message: "Unable to update employee info details." });
    }
    await connection.commit();
    return res.status(200).json({ code: 200, message: "Success" });
  } catch (error: any) {
    console.log(error);
    if (error.message === "jwt expired") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    } else if (error.message === "invalid token") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    } else if (error.message === "invalid signature") {
      return res.status(401).json({ code: 401, message: "Unauthorized" });
    } else {
      return res
        .status(500)
        .json({ code: 500, message: "Internal server error" });
    }
  } finally {
    await connection.release();
  }
}

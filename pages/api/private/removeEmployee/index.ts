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
  if (req.method != "POST") {
    return res
      .status(400)
      .json({ code: 400, message: "Only POST requests allowed" });
  }
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  const { employee_id,user_id } = req.body;
  try {
    jwt.verify(auth, JWT_SECRET);
    const transaction=await connection.beginTransaction();
    const [RemoveEmployee] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE employee_info SET is_exist=0 , removed_at=current_timestamp() WHERE id=?`,
        [employee_id]
      )
    );
    if (RemoveEmployee.affectedRows == 0) {
        await connection.rollback();
      return res.status(400).json({ code: 400, message: "Employee not found" });
    }
    console.log(user_id)
    const [RemoveUser]=<RowDataPacket[]> await connection.query(
        `UPDATE users SET is_exist=0 ,removed_at=current_timestamp() where id=? and is_exist=1`
    ,[user_id])
    console.log(RemoveUser)
    if (RemoveUser.affectedRows == 0) {
        await connection.rollback();
      return res.status(400).json({ code: 400, message: "User not found" });
    }
    await connection.commit();
    return res
      .status(200)
      .json({ code: 200, message: "Employee removed successfully" });
  } catch (error: any) {
    return res.status(500).json({ code: 500, message: error.message });
  } finally {
    connection.release();
  }
}

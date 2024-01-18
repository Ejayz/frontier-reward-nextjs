import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "GET") {
    return res.status(405).json({ code: 405, message: "Method not allowed" });
  }
  const { user_id } = req.query;
  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    const [employeeInfo] = <RowDataPacket[]>(
      await connection.query(
        `SELECT *,employee_info.id AS CoreId FROM employee_info LEFT JOIN users ON users.id=employee_info.user_id LEFT JOIN user_type ON users.user_type=user_type.id WHERE employee_info.id=? AND employee_info.is_exist=1 AND users.user_type!=1`,
        [user_id]
      )
    );
    if(employeeInfo.length==0){
        return res.status(404).json({code:404,message:"Employee not found"});
        }
    return res
      .status(200)
      .json({ code: 200, message: "Success", data: employeeInfo });
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    }
    return res
      .status(500)
      .json({ code: 500, message: "Internal server error" });
  }finally{
        await connection.release();
  }
}

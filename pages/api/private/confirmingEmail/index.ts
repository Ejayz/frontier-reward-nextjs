
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import Connection from "../../db";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ code: 405, message: "Method Not Allowed" });
  }
  const { token } = req.body;

  const connection=await Connection.getConnection();
  try {
    const verify = jwt.verify(token, JWT_SECRET);
    if (typeof verify == "string") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    }
 

    const [results,fields]= <RowDataPacket[]>await  connection.query(`UPDATE users SET email_verified_at=? where id=? and is_exist=1`, [new Date(), verify.id])
    if (results.affectedRows == 0) {
      return res
        .status(500)
        .json({ code: 500, message: "Internal Server Error" });
    } else {
      
      const [results] =<RowDataPacket[]>await connection.query(`SELECT *,employee_info.id AS employee_id , customer_info.id AS customer_id ,users.id as core_id FROM users LEFT JOIN user_type ON user_type.id=users.user_type LEFT JOIN customer_info ON customer_info.user_id=users.id LEFT JOIN employee_info ON employee_info.user_id= users.id WHERE users.id='${verify.id}' AND users.is_exist=1`);
   
      let token;
      if(results[0].code=="(NULL)"  || results[0].code==undefined || results[0].code==null){
        token=jwt.sign(
          {
            id: results[0].core_id,
            role: results[0].user_type,
            role_name: results[0].name,
            main_id:
              results[0].employee_id ==undefined || results[0].employee_id==null
                ? results[0].customer_id
                : results[0].employee_id,
            is_employee: results[0].employee_id==null ? false : true,
            is_email_verified: results[0].email_verified_at ? true : false,
            code:results[0].code
          },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        )
   }else if( results[0].password_change_at==undefined || results[0].password_change_at==null){
     token=jwt.sign(
        {
          id: results[0].core_id,
          role: results[0].name,
          role_name: results[0].name,
          main_id:
          results[0].employee_id ==undefined || results[0].employee_id==null
            ? results[0].customer_id
            : results[0].employee_id,
            is_employee: results[0].employee_id==null ? false : true,
            is_email_verified: results[0].email_verified_at ? true : false,
          code:results[0].code,
          password_change_at:false
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      )
      }else{
      
        token=jwt.sign(
          {
            id: results[0].core_id,
            role: results[0].user_type,
            role_name: results[0].name,
            main_id:
            results[0].employee_id ==undefined || results[0].employee_id==null
              ? results[0].customer_id
              : results[0].employee_id,
              is_employee: results[0].employee_id==null ? false : true,
              is_email_verified: results[0].email_verified_at ? true : false,
          },
          JWT_SECRET,
          {
            expiresIn: "1h",
          }
        )
      }
     
      return res
      .setHeader("Set-Cookie", `auth=${token};path=/;max-age=3600;"`)
        .status(200)
        .json({ code: 200, message: "Email Verified","passwordToken":token });
    }
  } catch (error: any) {
    console.log(error)
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token Not Active" });
    } else {
      return res
        .status(500)
        .json({ code: 401, message: "Internal Server Error" });
    }
  } finally {
    Connection.releaseConnection(connection);
  }
}

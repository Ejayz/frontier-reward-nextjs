import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();
const jwt_secret = process.env.JWT_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const connection = await instance.getConnection();
  let token;

  if (req.method !== "POST") {
    res.status(405).json({ code: 405, message: "Method not allowed" });
    return;
  }
  if (req.body.email === "" || req.body.password === "") {
    res
      .status(400)
      .json({ code: 400, message: "Email and password are required" });
    return;
  }
  const { email, password } = req.body;

  try {
    const [results] = <RowDataPacket[]>(
      await connection.query(
        `SELECT *,employee_info.id AS employee_id , customer_info.id AS customer_id,users.id as core_id  FROM users LEFT JOIN user_type ON user_type.id=users.user_type LEFT JOIN customer_info ON customer_info.user_id=users.id LEFT JOIN employee_info ON employee_info.user_id= users.id WHERE users.email=? AND users.is_exist=1`,
        [email]
      )
    );

    if (Array.isArray(results) && results.length === 0) {
      return res
        .status(404)
        .json({ code: 404, message: "Invalid credentials used." });
    }
    console.log("user details", results);
    const fName = results[0].first_name;
    const lName = results[0].last_name;
    console.log("User Name:", lName + " " + fName);
    const passwordValid = await bcrypt.compare(password, results[0].password);
    if (!passwordValid) {
      res.status(401).json({ code: 401, message: "Invalid credentials used." });
      return;
    }

    if (
      results[0].code == "(NULL)" ||
      results[0].code == undefined ||
      results[0].code == null
    ) {
      token = jwt.sign(
        {
          id: results[0].core_id,
          role: results[0].user_type,
          role_name: results[0].name,
          name: results[0].first_name + " " + results[0].last_name,
          main_id:
            results[0].employee_id == undefined ||
            results[0].employee_id == null
              ? results[0].customer_id
              : results[0].employee_id,
          package_id: results[0].package_id,
          is_employee: results[0].employee_id == null ? false : true,
          is_email_verified: results[0].email_verified_at ? true : false,
          code: results[0].code,
        },
        jwt_secret,
        {
          expiresIn: "1h",
        }
      );
    } else if (
      results[0].password_change_at == undefined ||
      results[0].password_change_at == null
    ) {
      token = jwt.sign(
        {
          id: results[0].core_id,
          role: results[0].name,
          name: results[0].first_name + " " + results[0].last_name,
          role_name: results[0].name,
          main_id:
            results[0].employee_id == undefined ||
            results[0].employee_id == null
              ? results[0].customer_id
              : results[0].employee_id,
          package_id: results[0].package_id,
          is_employee: results[0].employee_id == null ? false : true,
          is_email_verified: results[0].email_verified_at ? true : false,
          code: results[0].code,
          password_change_at: false,
        },
        jwt_secret,
        {
          expiresIn: "1h",
        }
      );
    } else {
      token = jwt.sign(
        {
          id: results[0].core_id,
          role: results[0].user_type,
          name: results[0].first_name + " " + results[0].last_name,
          role_name: results[0].name,
          main_id:
            results[0].employee_id == undefined ||
            results[0].employee_id == null
              ? results[0].customer_id
              : results[0].employee_id,
          package_id: results[0].package_id,
          is_employee: results[0].employee_id == null ? false : true,
          is_email_verified: results[0].email_verified_at ? true : false,
        },
        jwt_secret,
        {
          expiresIn: "1h",
        }
      );
    }
    res
      .setHeader("Set-Cookie", `auth=${token};path=/;max-age=3600;`)
      .status(200)
      .json({
        code: 200,
        message: "Login successful",
        token: {
          id: results[0].id,
          role: results[0].user_type,
          name: results[0].first_name + " " + results[0].last_name,
          role_name: results[0].name,
          phone_number: results[0].phone_number,
          email: results[0].email,
          main_id:
            results[0].employee_id == undefined ||
            results[0].employee_id == null
              ? results[0].customer_id
              : results[0].employee_id,
          is_employee: results[0].employee_id == null ? false : true,
          is_email_verified: results[0].email_verified_at ? true : false,
          password_change_at:
            results[0].password_change_at == null ? false : true,
        },
      });
  } catch (error: any) {
    res.status(500).json({ code: 500, message: error.message });
  } finally {
    await connection.release();
  }
}

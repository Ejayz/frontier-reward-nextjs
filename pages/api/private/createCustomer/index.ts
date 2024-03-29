import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import { Resend } from "resend";
import * as generator from "generate-password";
import * as bcrypt from "bcrypt";
import AccountCreation from "@/react-email-starter/emails/account-creation";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_API = process.env.RESEND_SECRET || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    firstName,
    middleName,
    lastName,
    phoneNumber,
    email,
    packageId,
    vehicles,
    country,
    city,
    zipCode,
    address,
    address2,
    state_province,
    points,
    suffix,
  } = req.body;

  const resend = new Resend(RESEND_API);
  const auth = new Cookies(req, res).get("auth") || "";
  const connection = await instance.getConnection();
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      return res.status(401).json({ code: 401, message: "Invalid token" });
    } else if (verify?.main_id) {
      current_user = verify.main_id;
    } else {
      return res
        .status(401)
        .json({ code: 401, message: "Invalid token format" });
    }
    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const transaction = await connection.beginTransaction();
    const [getUsers, fields] = <RowDataPacket[]>(
      await connection.query(
        "SELECT * FROM users WHERE email = ? and is_exist=1",
        [email]
      )
    );

    if (getUsers.length > 0) {
      connection.rollback();
      return res
        .status(400)
        .json({ code: 400, message: "Email already exist" });
    }

    const [results, insertUser] = <RowDataPacket[]>(
      await connection.query(
        `INSERT INTO users (email, password, phone_number, user_type, is_exist) VALUES (?,?,?,?,?)`,
        [email, hashedPassword, phoneNumber, 4, 1]
      )
    );
    if (results.affectedRows == 0) {
      connection.rollback();
      return res.status(400).json({
        code: 400,
        message: "Something went wrong. Please try again later.",
      });
    }
    console.log("insertUser:", results);
    const processedVehicles = await formatVehicle(vehicles, results.insertId);
    const [insertCustomerAddressResult, insertCustomerAddressFields] = <
      RowDataPacket[]
    >await connection.query(
      `INSERT INTO customer_address (country, city, zip_code, address_1, address_2, state_province) VALUES (?,?,?,?,?,?)`,
      [country, city, zipCode, address, address2, state_province]
    );

    if (insertCustomerAddressResult.affectedRows == 0) {
      connection.rollback();
      return res.status(400).json({
        code: 400,
        message: "Something went wrong. Please try again later.",
      });
    }

    const [insertCustomerInfoResult, insertCustomerInfoFields] = <
      RowDataPacket[]
    >await connection.query(
      `INSERT INTO customer_info (first_name, middle_name, last_name, points, suffix, user_id, address_id, package_id, employee_id) VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        firstName,
        middleName,
        lastName,
        points,
        suffix,
        results.insertId,
        insertCustomerAddressResult.insertId,
        packageId,
        current_user,
      ]
    );
    if (insertCustomerInfoResult.affectedRows == 0) {
      connection.rollback();
      return res.status(400).json({
        code: 400,
        message: "Something went wrong. Please try again later.",
      });
    }
    for (const vehicle of processedVehicles) {
      const [insertCustomerVehicleInfoResult, insertCustomerVehicleInfoFields] =
        <RowDataPacket[]>(
          await connection.query(
            `UPDATE customer_vehicle_info SET customer_info_id = ? where vin_id = ? and is_exist=1`,
            [insertCustomerInfoResult.insertId, vehicle.vin_no]
          )
        );
      if (insertCustomerVehicleInfoResult.affectedRows == 0) {
        connection.rollback();
        return res.status(400).json({
          code: 400,
          message: "Something went wrong. Please try again later.",
        });
      }
    }
    const base_url = `https://${req.headers.host}/`;
    const data = await resend.emails.send({
      from: "Register@PointsAndPerks <register.noreply@pointsandperks.ca>",
      to: [email],
      subject: "Welcome to Perks and Points",
      react: AccountCreation({
        first_name: firstName,
        last_name: lastName,
        password: password,
        email: email,
        base_url: base_url,
      }),
      text: `Welcome to Perks and Points!`,
    });

    if (data) {
      connection.commit();
      return res.status(200).json({
        code: 200,
        message:
          "Kindly remind the newly created account holder to check their email for login credentials.",
      });
    } else {
      return res.status(400).json({
        code: 400,
        message: "Something went wrong. Please try again later.",
      });
    }
  } catch (error: any) {
    console.log("error", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "Token not active" });
    } else {
      return res.status(500).json({ code: 500, message: error.message });
    }
  } finally {
    await connection.release();
  }
}

function formatVehicle(data: any, user_id: any) {
  const newArray = data.map((vehicle: any) => {
    const { year, model, trim, color, vin_no } = vehicle;
    const vehicleInfo = {
      year,
      model,
      trim,
      color,
      vin_no,
    };
    console.log("vehicleInfo:", vehicleInfo);
    return vehicleInfo;
  });

  return newArray;
}

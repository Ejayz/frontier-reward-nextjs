import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import Connection from "../../db";
import { RowProps } from "@react-email/components";
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
  const connection = await Connection.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      packageId,
      country,
      city,
      zipCode,
      address,
      address2,
      state_province,
      points,
      suffix,
    } = req.body;

    const getDate = Date.parse(new Date().toString());

    const transaction = await connection.beginTransaction();
    const [UpdateUserAccount] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE customer_info SET first_name=?,middle_name=?,last_name=?,phone_number=?,email=?,package_id=?,points=?,suffix=?,updated_at=? WHERE id=? and is_exist=1`,
        [
          firstName,
          middleName,
          lastName,
          phoneNumber,
          email,
          packageId,
          points,
          suffix,
          getDate,
          verify.id,
        ]
      )
    );

    if (UpdateUserAccount.affectedRows == 0) {
      await connection.rollback();
      return res.status(404).json({ code: 404, message: "Customer not found" });
    } else {
      const [UpdateUserAddress] = <RowDataPacket[]>(
        await connection.query(
          `UPDATE customer_address SET country=?,city=?,zip_code=?,address_1=?,address_2=?,state_province=?,updated_at=? WHERE id=? and is_exist=1`,
          [
            country,
            city,
            zipCode,
            address,
            address2,
            state_province,
            getDate,
            verify.id,
          ]
        )
      );

      if (UpdateUserAddress.affectedRows == 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ code: 404, message: "Customer not found" });
      }
      await connection.commit();
      return res
        .status(200)
        .json({
          code: 200,
          message: "Customer information updated successfully",
        });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ code: 401, message: "jwt expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ code: 401, message: "jwt malformed" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ code: 401, message: "jwt not active" });
    } else {
      return res.status(401).json({
        code: 500,
        message: "Something went wrong. Please try again.",
      });
    }
  } finally {
    await Connection.releaseConnection(connection);
  }
}

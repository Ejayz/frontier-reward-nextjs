import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import instance from "../../db";
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

  const connection = await instance.getConnection();
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    const {
      CoreId,
      UserId,
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
    console.log(CoreId,UserId)
    const getDate = Date.parse(new Date().toString());

    const transaction = await await connection.beginTransaction();
    const [UpdateUserAccount] = <RowDataPacket[]>(
      await connection.query(
        `UPDATE customer_info SET first_name=?,middle_name=?,last_name=?,package_id=?,points=?,suffix=?,updated_at=? WHERE id=? and is_exist=1`,
        [
          firstName,
          middleName,
          lastName,
          packageId,
          points,
          suffix,
          getDate,
        CoreId
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
            CoreId,
          ]
        )
      );

      if (UpdateUserAddress.affectedRows == 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ code: 404, message: "Customer not found" });
      }
      const [UpdateUsers]=<RowDataPacket[]>await connection.query(`UPDATE users SET phone_number=?,email=?,updated_at=current_timestamp()  WHERE id=? and is_exist=1`,[phoneNumber,email,UserId]) 
      if(UpdateUsers.affectedRows==0){
        await connection.rollback();
        return res.status(404).json({code:404,message:"Customer not found"})
      }
      await connection.commit();
      return res.status(200).json({
        code: 200,
        message: "Customer information updated successfully",
      });
    } 

  } catch (error: any) {
    console.log(error);

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
   await connection.release();
  }
}

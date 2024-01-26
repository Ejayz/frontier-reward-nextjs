import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
dotenv.config();

 const JWT_SECRET=process.env.JWT_SECRET || "";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({code:405, message:"Method not allowed"})
    }
    const auth = new Cookies(req, res).get("auth") || "";
    const connection = await instance.getConnection();
    const {year, model, trim, color, vin_no, car_id} = req.body;
   


    console.log(req.body)
    console.log(typeof req.body)
    try{
        const verify = jwt.verify(auth, JWT_SECRET);
        if(typeof verify === "string"){
            return res.status(401).json({code:401, message:"User is not authenticated"})
        }
        const transaction = await connection.beginTransaction();
        const [CheckVinResult, CheckVinFields] = <RowDataPacket[]>await connection.query(`SELECT * FROM customer_vehicle_info WHERE vin_id=? and is_exist=1`, [vin_no])
        if(CheckVinResult.length > 0){
            await connection.rollback();
            return res.status(400).json({code:400, message:"Vin already exist"})
        }
        const [CustomerVehicleUpdateResult, CustomerVehicleUpdateFields] = <RowDataPacket[]>await connection.query(`UPDATE customer_vehicle_info SET vin_id=?,year=?,model=?,trim=?,color=?,updated_at=current_timestamp() WHERE id=? and is_exist=1`, [vin_no, year, model, trim, color, car_id])
        if(CustomerVehicleUpdateResult.affectedRows == 0){
            await connection.rollback();
            return res.status(400).json({code:400, message:"Failed to update car"})
        }
        await connection.commit();
        return res.status(200).json({code:200, message:"Vehicle Information Updated Successfully!"})
    }catch(error:any){ 
        console.log(error)
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({code:401, message:"Token expired"})
        } else if(error.name === "JsonWebTokenError"){
            return res.status(401).json({code:401, message:"Invalid token"})
        }else if(error.name === "JsonWebTokenError"){
            return res.status(401).json({code:401, message:"Invalid token"})
        }else{
            return res.status(500).json({code:500, message:"Internal Server error"})
        }
    }finally{
        await connection.release();
    }
}
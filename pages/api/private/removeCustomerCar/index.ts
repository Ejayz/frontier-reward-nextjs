import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET || "";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({code:405, message:"Method not allowed"})
    }
   const auth=new Cookies(req,res).get("auth")||"";
   const {car_id}=req.body;
   const connection = await instance.getConnection();
    try{
    const verify=jwt.verify(auth,JWT_SECRET);
    if(typeof verify==="string"){
        return res.status(401).json({code:401,message:"User is not authenticated"})
    }
    const transaction=await connection.beginTransaction();
    const [removeCarResult]=<RowDataPacket[]>await connection.query(`UPDATE customer_vehicle_info SET is_exist=0,removed_at=current_timestamp() WHERE id=?`,[car_id])
    if(removeCarResult.affectedRows==0){
        await connection.rollback();
        return res.status(400).json({code:400,message:"Failed to remove car"})
    }
    await connection.commit();
    return res.status(200).json({code:200,message:"Vehicle Information Removed Successfully!"})
    }catch(error:any){ 
        console.log(error)
        return res.status(500).json({code:500, message:"Internal Server error"})
    }
}
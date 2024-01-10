import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";

import Connection from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET||"";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    if(req.method !== "GET"){
        return res.status(405).json({code:405,message:"Method not allowed"})
    }
  
    const auth=new Cookies(req,res).get("auth")||"";
    const verify = jwt.verify(auth, JWT_SECRET);
    if (typeof verify === "string") {
      return res
        .status(401)
        .json({ code: 401, message: "User is not authenticated" });
    }
    if(req.query.user_id==undefined){
        return res.status(400).json({code:400,message:"User id is required"})
    }
    const connection=await Connection.getConnection();
    try{
        const user_id=req.query.user_id||0;
        if(typeof user_id !== "string"){
            return res.status(400).json({code:400,message:"User id must be a string"})
        }
        const [customerResult,customerFields]=<RowDataPacket[]>await connection.query(`SELECT * FROM customer_info LEFT JOIN customer_address ON customer_address.id=customer_info.address_id LEFT JOIN packages ON packages.id = customer_info.package_id LEFT JOIN users ON users.id ON customer_info.user_id WHERE customer_info.id=? and is_exist=1`,[user_id])
        const [customerVehicleResult,customerVehicleFields]=<RowDataPacket[]>await connection.query(`SELECT *,vin_id as vin_no, id as table_uuid FROM customer_vehicle_info WHERE customer_info_id=? and is_exist=1`,[user_id])

       
        if(customerResult.length==0){
            return res.status(404).json({code:404,message:"Customer not found"})
        }

       return res.status(200).json({code:200,message:"Success",data:customerResult,vehicles:customerVehicleResult})
    }catch(error:any){
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ code: 401, message: "jwt expired" });
          } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ code: 401, message: "jwt malformed" });
          } else if (error.name === "NotBeforeError") {
            return res.status(401).json({ code: 401, message: "jwt not active" });
          } else {
            return res
              .status(401)
              .json({ code: 401, message: "User is not authenticated" });
          }
    }
finally{
  await Connection.releaseConnection(connection);
}

}

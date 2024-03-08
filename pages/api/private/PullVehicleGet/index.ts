import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import instance from "../../db";
import { RowDataPacket } from "mysql2";

dotenv.config();

const USERNAME = process.env.USERNAME || "";
const PASSWORD = process.env.PASSWORD || "";
const SERIAL_NUMBER = process.env.SERIAL_NUMBER || "";

interface ExteriorColor {
  Description: string;
}

interface InteriorColor {
  Description: string;
}

interface Order {
  Price: number;
  EstimatedCost: number;
  IgnitionKeyCode: string;
  Description: string;
  LocationStatusDate: string;
}

interface CustomField {
  Key: string;
  Type: string;
}

interface Insurance {
  ExpiryDate: string;
}

interface Hold {
  VehicleRef: string;
  HoldFrom: string;
  HoldUntil: string;
  UserRef: string;
  ContactRef: string;
}

interface Vehicle {
  Id: string;
  VehicleId: string;
  SerialNumber: string;
  StockNumber: string;
  VIN: string;
  LicenseNumber: string;
  FleetNumber: string;
  Status: string;
  OwnerRef: string;
  ModelNumber: string;
  Make: string;
  Model: string;
  Trim: string;
  VehicleType: string;
  Year: string;
  Odometer: number;
  ExteriorColor: ExteriorColor;
  InteriorColor: InteriorColor;
  Engine: string;
  Cylinders: string;
  Transmission: string;
  DriveWheel: string;
  Fuel: string;
  Weight: number;
  LastServiceMileage: number;
  Lot: string;
  LotDescription: string;
  Category: string;
  Options: any[]; // You can replace any[] with a more specific type if you know the structure of the Options array
  Refurbishments: any[]; // Same as Options
  Order: Order;
  MSR: number;
  BaseMSR: number;
  Retail: number;
  InternetPrice: number;
  Lotpack: number;
  Holdback: number;
  InternetNotes: string;
  Notes: string;
  CriticalMemo: string;
  IsCertified: boolean;
  LastUpdate: string;
  AppraisedValue: number;
  Warranties: any[]; // Same as Options
  Freight: number;
  Air: number;
  Inventory: number;
  IsInactive: boolean;
  CustomFields: CustomField[];
  FloorPlanCode: string;
  FloorPlanAmount: number;
  Insurance: Insurance;
  Body: string;
  ShortVIN: string;
  AdditionalDrivers: any[]; // Same as Options
  OrderDetails: any; // You can replace any with a more specific type if you know the structure of OrderDetails
  PrimaryImageRef: string;
  Hold: Hold;
  SeatingCapacity: string;
  IsConditionallySold: boolean;
  SalesDivision: number;
  StyleRef: string;
  TotalCost: number;
  BlueBookValue: number;
  VideoURL: string;
  ShowOnWeb: boolean;
  PDI: number;
  Configuration: string;
}

interface VehicleData {
  Vehicles: Vehicle[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var t0 = performance.now();
  const connection = await instance.getConnection();
  try {
    const Auth = btoa(USERNAME + ":" + PASSWORD);
    console.log(Auth);
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json",
      Authorization: `Basic RnJvbnRpZXI6YzMlRkIydDhAbg==`,
    };

    let response = await fetch(
      `https://partnerhub.pbsdealers.com/json/reply/VehicleGet?SerialNumber=${SERIAL_NUMBER}`,
      {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ SerialNumber: SERIAL_NUMBER }),
      }
    );

    const FinalData = <any>[];

    let data = await response.json();
    console.log(data.Vehicles.length);
    data.Vehicles.forEach((element: any) => {
      const trim = element.Trim;
      const VIN = element.VIN;
      const color = element.ExteriorColor.Description;
      const model = element.Model;
      const year = element.Year;
      if (VIN == null || VIN == undefined || VIN == "") {
        return;
      }
      FinalData.push([trim, VIN, color, model, year]);
    });

    connection.beginTransaction();
    const NumberOfRowPerInsert = 10000;
    const getRound = Math.ceil(FinalData.length / NumberOfRowPerInsert);
    console.log(getRound);
    let lastIndex = 0;

    for (
      let BulkInsertIndex = 0;
      BulkInsertIndex < getRound;
      BulkInsertIndex++
    ) {
      const insertQuery = `INSERT IGNORE INTO customer_vehicle_info (trim, vin_id, color, model, year) VALUES ?`;
      const calculateLastIndex = (BulkInsertIndex + 1) * NumberOfRowPerInsert;
      try {
        const [CacheOps] = <RowDataPacket[]>(
          await connection.query(insertQuery, [
            FinalData.slice(lastIndex, calculateLastIndex),
          ])
        );
        console.log(CacheOps.insertId);
        lastIndex = calculateLastIndex;
      } catch (error) {
        console.error(error);
      }
    }
    connection.commit();
    var t1 = performance.now();
    const timeTaken = t1 - t0;
    return res.status(200).json({
      code: 200,
      message: `Cache Update Successfull. It took ${timeTaken} to do this operation`,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ code: 500, error: error.message });
  }
}

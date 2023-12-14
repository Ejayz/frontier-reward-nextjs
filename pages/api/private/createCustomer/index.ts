import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { EmailTemplate } from "../../../../components/UserAccountEmail";
import * as generator from "generate-password";
import * as bcrypt from "bcrypt";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const RESEND_API = process.env.RESEND_SECRET || "";
const BASE_URL = process.env.BASE_URL || "";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  if (!req.body) {
    return res.status(400).json({ message: "No body provided" });
  }
  console.log(req.body);
  const prisma = new PrismaClient();
  const resend = new Resend(RESEND_API);
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    });
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      packageId,
      middleName,
      vehicles,
      country,
      city,
      zipCode,
      address,
      address2,
      state_province,
      points,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const transaction = await prisma.$transaction(async (tx) => {
      try {
        const getUsers = await tx.users.findMany({
          where: { email: email, is_exsit: true },
        });

        if (getUsers.length > 0) {
          return res.status(400).json({ message: "Email already exist" });
        }

        const customer = await tx.users.create({
          data: {
            name: firstName + " " + middleName + "" + lastName,
            firstname: firstName,
            lastname: lastName,
            middlename: middleName,
            phone_number: phoneNumber,
            email: email,
            password: hashedPassword,
            user_type_id: 1,
            points: points,
          },
        });

        const processedVehicles = await formatVehicle(vehicles, customer.id);

        const customerAddress = await tx.addresses.create({
          data: {
            user_id: customer.id,
            country: country,
            city: city,
            zipcode: zipCode,
            address: address,
            address2: address2,
            state_province: state_province,
          },
        });
        console.log("processedVehicles:", processedVehicles);
        const user_vehicle = await tx.user_vehicles.createMany({
          data: processedVehicles,
        });
        const data = await resend.emails.send({
          from: "Register@PointsAndPerks <register.noreply@sledgedevsteam.lol>",
          to: [email],
          subject: "Welcome to Perks and Points",
          react: EmailTemplate({
            firstName: firstName,
            last_name: lastName,
            password: password,
            email: email,
            base_url: BASE_URL,
          }),
          text: `Welcome to Perks and Points!`,
        });

        return res.status(200).json({ message: "Successfully created" });
      } catch (err: any) {
        console.log(err);
      }
    });
    console.log("transactions:", transaction);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({ message: "Token not active" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  } finally {
    await prisma.$disconnect();
  }
}

function formatVehicle(data: any, user_id: any) {
  const newArray = data.map((vehicle: any) => {
    const { vehicle_id, year, model, trim, color, vin_no } = vehicle;
    const vehicleInfo = {
      year,
      model,
      trim,
      color,
      vin_no,
    };
    return {
      user_id: user_id,
      vehicle_id,
      vehicle_info: JSON.stringify(vehicleInfo),
    };
  });

  return newArray;
}

import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { EmailTemplate } from "../../../../components/UserAccountEmail";
import * as generator from "generate-password";
import * as bcrypt from "bcrypt";
import AccountCreation from "@/react-email-starter/emails/account-creation";
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
  console.log("req.body:", req.body);
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
    suffix
  } = req.body;
  const prisma = new PrismaClient();
  const resend = new Resend(RESEND_API);
  const auth = new Cookies(req, res).get("auth") || "";
  try {
    const verify = jwt.verify(auth, JWT_SECRET);
    let current_user = 0;
    if (typeof verify === "string") {
      // Handle the case where verify is a string (no access to id)
      console.log("User is not authenticated");
    } else if (verify?.main_id) {
      // Access the id property only if it exists in the JwtPayload
      current_user = verify.main_id;
      console.log(`Current user ID: ${current_user}`);
    } else {
      // Handle any other unexpected verification result
      console.error("Invalid token format");
    }
    const password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
    });

    console.log(
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
     suffix
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    const transaction = await prisma
      .$transaction(async (tx) => {
        console.log("Email", email);
        const getUsers = await tx.users.findMany({
          where: { email: email, is_exist: 1 },
        });
        console.log("getUsers:", getUsers);
        if (getUsers.length > 0) {
          return res
            .status(400)
            .json({ code: 400, message: "Email already exist" });
        }
        console.log("Checked getUsers lenght:", getUsers.length);
        for (const vehicle of vehicles) {
          const getvehicle = await tx.customer_vehicle_info.findMany({
            where: {  vin_id:vehicle.vin_no, is_exist: 1 },
          });
          console.log(`Checking Vehicle ${vehicle.vehicle_id} :`, getvehicle);
          if (getvehicle.length > 0) {
            return res
              .status(400)
              .json({ code: "400", message: "Vehicle already exist" });
            break;
          }
          console.log("Checked getvehicle lenght:", getvehicle.length);
        }

        const customer = await tx.users.create({
          data: {
           email: email,
           password: hashedPassword,
           phone_number: phoneNumber,
           user_type: 4,
            is_exist: 1,
          },
        });
        console.log("customer INSERTED", customer);
        const processedVehicles = await formatVehicle(vehicles, customer.id);
        console.log("processedVehicles:", processedVehicles);
      
        const customerAddress = await tx.customer_address.create({
          data: {
            country: country,
            city: city,
            zip_code: zipCode,
            address_1: address,
            address_2: address2,
            state_province: state_province,
          },
        });

     

       const creationOfUserInfo =   await tx.customer_info.create({
            data: {
              first_name: firstName,
              middle_name: middleName,
              last_name: lastName,
              points: points,
              suffix : suffix,
              user_id: customer.id,
              address_id: customerAddress.id,
              package_id: parseInt(packageId),
             employee_id: current_user,
            },
          });
  
          for (const vehicle of processedVehicles) {
          await tx.customer_vehicle_info.create({
            data: {
              customer_id: creationOfUserInfo.id,
               color: vehicle.color,
              trim: vehicle.trim,
              year:`${ vehicle.year}`,
              vin_id: vehicle.vin_no,

            },
          });
        }
        console.log("Inserting ");
        const data = await resend.emails.send({
          from: "Register@PointsAndPerks <register.noreply@sledgehammerdevelopmentteam.uk>",
          to: [email],
          subject: "Welcome to Perks and Points",
          react: AccountCreation({
            first_name: firstName ,
            last_name: lastName,
            password: password,
            email: email,
            base_url: "https://perksandpoints.com/",
          }),
          text: `Welcome to Perks and Points!`,
        });
        return res.status(200).json({
          code: 200,
          message:
            "Kindly remind the newly created account holder to check their email for login credentials.",
        });
      })
      .then(console.log);
    console.log("transactions:", transaction);
  } catch (error: any) {
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
    await prisma.$disconnect();
  }
}

function formatVehicle(data: any, user_id: any) {
  const newArray = data.map((vehicle: any) => {
    const {  year, model, trim, color, vin_no } = vehicle;
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

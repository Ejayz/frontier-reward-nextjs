import jwt from "jsonwebtoken";
export default async function cookie_processor(cookies: string) {
  if (!cookies) return null;
  const token = cookies.split(";");
  const actual_token = token
    .find((item: string) => item.includes("auth"))
    ?.split("=")[1];
    console.log(actual_token)
  if (!actual_token) return null;
  const decoded = jwt.decode(actual_token);
  if (!decoded) return null;
  return decoded;
}

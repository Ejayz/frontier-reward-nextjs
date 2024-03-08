import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const username = "Frontier";
  const password = "c3%FB2t8@n";
  const serialNumber = "9991.QA";

  const basicAuth = btoa(`${username}:${password}`);

  const url = "https://partnerhub.pbsdealers.com/json/reply/VehicleGet";

  const requestBody = {
    SerialNumber: serialNumber,
  };

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`, // Include Basic Authentication header
    },
    body: JSON.stringify(requestBody),
  };

  const data = await fetch(url, options);
  console.log(data);
  return res.status(200).send(data.text());
}

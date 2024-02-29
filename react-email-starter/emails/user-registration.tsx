import {
    Container,
    Html,
    Head,
    Img,
    Tailwind,
    Preview,
    Text,
    Body,
    Section,
  } from "@react-email/components";
  import * as dotenv from "dotenv";
  dotenv.config();
  interface EmailTemplateProps {
    firstName: string;
    last_name: string;
    password: string;
    email: string;
  }
  const VERCEL_URL = "https://sledgehammerdevelopmentteam.uk";
  const baseUrl = "https://pointsandperks.ca";
  const receivedRewards = ({
    first_name = "",
    last_name = "",
    password = "",
    email = "",
    base_url = "",
  }) => (
    <Html>
      {" "}
      <Tailwind
        config={{
          content: [
            "./pages/**/*.{js,ts,jsx,tsx,mdx}",
            "./components/**/*.{js,ts,jsx,tsx,mdx}",
            "./app/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/**/*.{html,js}",
          ],
          theme: {
            extend: {
              backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
              },
            },
          },
          plugins: [require("daisyui")],
        }}
      >
        <Head />
        <Preview>noreply@pointsandperks-Received Rewards.</Preview>
        <Body className="bg-white text-black">
          <Container className="border border-solid border-[#eaeaea] bg-white rounded my-[40px] mx-auto p-[20px] w-[750px] max-w-5xl	 ">
            <Section className="mt-4 text-center">
            <Img
                src={`${baseUrl}/static/logo-nav.png`}
                alt="Points and Perks Logo"
                width={215}
                height={48}
                className="mx-auto "
              />
              <Text className="text-2xl mx-auto font-sans w-full font-bold">
                Welcome {last_name} , {first_name}!
              </Text>
            </Section>
            <Text className={"text-xl font-sans font-bold"}>
              Welcome!
            </Text>
            <Text className={"text-xl font-sans font-semibold text-gray-700"}>
              Your password is {password}.
            </Text>
            <Text className={"text-xl font-sans font-semibold text-gray-700"}>
             You can now ean and collect points from your purchase and get a chance to win awesome rewards! Be updated with our new deals and win these awesome prizes!
            </Text>
                     
            <Text className={"text-xl font-sans"}>
              If you have any questions, You may reach us here:
            </Text>
    <br />
            <div className="flex justify-center gap-4">
            <Text className={"text-lg font-sans flex gap-2"}>
            <a
                href={`mailto:ask@pointsandperks.com`}
                style={{ color: "#0000ff" }}
                className="mt-4"
              ><Img
            src="https://pointsandperks.ca/static/mail.svg"
            alt="Points and Perks Logo"
            width={60}
            height={60}
            className="place-content-start "
          />
              </a>
            </Text>
            <Text className={"text-lg font-sans flex gap-2"}>
           
              <a
                href="https://pap.pointsandperks.ca/"
                style={{ color: "#0000ff" }}
                className="mt-4"
              > <Img
                src="https://pointsandperks.ca/static/browser.svg"
                alt="Points and Perks Logo"
                width={60}
                height={60}
                className="place-content-start"
              />
              </a>
            </Text>
            <Text className={"text-lg font-sans flex gap-2"}>  
         
              <a href="https://maps.app.goo.gl/FohkqgaFKQto7LKd7"
                style={{ color: "#0000ff" }}
                className="mt-4">   
              <Img
                src="https://pointsandperks.ca/static/location.svg"
                alt="Points and Perks Logo"
                width={60}
                height={60}
                className="place-content-start"
              />
              </a>
            </Text>
            </div>
            <br />
            <Text className={"text-lg font-sans"}>
              If you did not register for an account, please disregard or delete
              this email.
            </Text>
            <Text className={"text-lg font-sans"}>
              Do not reply to this email. This mailbox is not monitored and you
              will not receive a response. For assistance , use the above contact
              information.
            </Text>
          </Container>{" "}
        </Body>
      </Tailwind>
    </Html>
  );
  
  export default receivedRewards;
  
  const main = {
    backgroundColor: "#ffffff",
  };
  
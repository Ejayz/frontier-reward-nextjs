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
  const baseUrl = "https://sledgehammerdevelopmentteam.uk";
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
             
            </Section>
            <Text className={"text-2xl font-sans font-bold"}>
              GOOD NEWS!
            </Text>
            <Text className={"text-2xl font-sans font-semibold text-gray-700"}>
              Are you ready to win Customer Reveiew? Earn atleast Required points to get the awesome reward!
            </Text>
            <Text className={"text-2xl font-sans font-semibold text-gray-700"}>
             Visit <a href={`${base_url}`}>http://fr-api.thedreamteamdigitalmarketing.com</a>{" "} for more info.
            </Text>
            <Text className={"text-2xl font-sans font-semibold text-gray-700"}>
              Thanks,
            </Text>
            <Text className={"text-2xl font-sans font-semibold text-gray-700"}>
              Frontier Rewards  
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
  
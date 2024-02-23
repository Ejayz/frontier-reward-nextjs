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
    email: string;
  }
  const VERCEL_URL = "https://sledgehammerdevelopmentteam.uk";
  const baseUrl = "https://sledgehammerdevelopmentteam.uk";
  const NewRedeem = ({
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
        <Preview>noreply@pointsandperks-New Redeem created.</Preview>
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
            <br/>
            <br/>

            <Text className="text-2xl mx-auto font-sans w-full font-bold">
                Dear Customer,
              </Text>
            <Text className={"text-base font-sans"}>
            We are delighted to inform you that a new redeem is now available for you. Take advantage of this opportunity by visiting our platform and exploring the latest offers.
            </Text>
            
            <Text className={"text-base font-sans"}>
              <strong>Best Regards,</strong>
            </Text>
            <Text className={"text-base font-sans"}>
              <strong>Perks and Points Team</strong>
            </Text>
            <Text className={"text-base font-sans"}>
              If you have any questions, You may reach us here:
            </Text>
  
            <Text className={"text-base font-sans"}>
              <strong>Email us at: </strong>
              <a
                href={`mailto:ask@pointsandperks.com`}
                style={{ color: "#0000ff" }}
              >
                indiancarguy@gmail.com
              </a>
            </Text>
  
            <Text className={"text-base font-sans"}>
              <strong>Call us at: </strong>
              <a href="tel:1-800-123-4567" style={{ color: "#0000ff" }}>
                6133158020
              </a>
            </Text>
            <Text className={"text-base font-sans"}>
              <strong>Visit our website: </strong>
              <a
                href="http://www.pointsandperks.com"
                style={{ color: "#0000ff" }}
              >
                www.pointsandperks.com
              </a>
            </Text>
            <Text className={"text-base font-sans"}>
              <strong>Visit our dealership: </strong>
              <span style={{ color: "#0000ff" }}>
                10060 Jasper Ave NW Suite 2020 Edmonton, AB, T5J 3R8 Canada
              </span>
            </Text>
            <br />
            <Text className={"text-sm font-sans"}>
              If you did not register for an account, please disregard or delete
              this email.
            </Text>
            <Text className={"text-sm font-sans"}>
              Do not reply to this email. This mailbox is not monitored and you
              will not receive a response. For assistance , use the above contact
              information.
            </Text>
          </Container>{" "}
        </Body>
      </Tailwind>
    </Html>
  );
  
  export default NewRedeem;
  
  const main = {
    backgroundColor: "#ffffff",
  };
  
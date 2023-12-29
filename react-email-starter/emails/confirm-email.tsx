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
  base_url: string;
}
const baseUrl = "https://sledgehammerdevelopmentteam.uk";

const ConfirmEmail = ({
  first_name = "April Jude",
  last_name = "Provido",
  password = "12345678",
  email = "jude.thedreamteam@gmail.com",
  base_url = "https://pointsandperks.com",
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
      <Preview>noreply@pointsandperks-Confirm Email.</Preview>
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
              Confirm email address
            </Text>
          </Section>
          <Text className="text-lg font-sans">
            Below is your email confirmation link . Use this to confirm this
            email addres:
          </Text>
          <Text className="text-base font-sans">
            <a href={"start/data"}>Verify Email</a>
          </Text>
          <Text className="text-lg font-sans">
            If the link above doesn't work, copy and paste the following URL
            into your browser:
          </Text>{" "}
          <Text className="text-base font-sans underline">{"https://somelink.com/?verify=12yuaseqweqsdasd"}</Text>
          <Text className="text-lg font-sans ">
            Please note that this verification link is valid for the next 24
            hours.{" "}
          </Text>
          <hr />
          <Text className="text-sm font-sans">
            If you didn't sign up for [Your Company/Platform Name], please
            disregard this email. Thank you, The [Your Company/Platform Name]
            Team{" "}
          </Text>
        </Container>{" "}
      </Body>
    </Tailwind>
  </Html>
);

export default ConfirmEmail;

const main = {
  backgroundColor: "#ffffff",
};

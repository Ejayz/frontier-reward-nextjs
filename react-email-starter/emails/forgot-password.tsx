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
  Button,
  Link,
} from "@react-email/components";
import * as dotenv from "dotenv";
dotenv.config();
interface EmailTemplateProps {
  verification_link: string;
  base_url: string;
}
const baseUrl = "https://sledgehammerdevelopmentteam.uk";

const ForgotPassword = ({
  forgot_password_link = "",
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
            <Text className="text-2xl mx-auto text-black font-sans w-full font-bold">
              Reset Password
            </Text>
          </Section>
          <Text className="text-lg font-sans">
            Click the button bellow to reset your password.
          </Text>
          <Section className=" text-center">
            <Button
              href={forgot_password_link}
              className="text-lg font-bold p-4 bg-yellow-500 text-black font-sans rounded-full "
            >
           Forgot Password
            </Button>
          </Section>
          <Text key="ins1" className="text-lg font-sans">
            If the button above doesn't work, copy and paste the following URL
            into your browser:
          </Text>{" "}
          <Section className="text-center">
            <Text className="text-base font-sans ">{forgot_password_link}</Text>
          </Section>
          <Text className="text-lg font-sans ">
            Please note that this forgot password link is valid for the next 15
            minutes.{" "}
          </Text>
          <hr />
          <Text className="text-sm font-sans">
            If you didn't request for forgot password, please disregard this
            email. Thank you, The Perks and Points Team{" "}
          </Text>
        </Container>{" "}
      </Body>
    </Tailwind>
  </Html>
);

export default ForgotPassword;

const main = {
  backgroundColor: "#ffffff",
};

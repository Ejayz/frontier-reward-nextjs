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
  firstName: string;
  last_name: string;
  verification_link: string;
  base_url: string;
}
const baseUrl = "https://sledgehammerdevelopmentteam.uk";

const ConfirmEmail = ({
  first_name = "April Jude",
  last_name = "Provido",
  password = "12345678",
  verification_link = "jude.thedreamteam@gmail.com",
  base_url = "https://pointsandperks.ca",
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
              Confirm email address
            </Text>
          </Section>
          <Text className="text-xl font-sans">
            Click the button bellow to confirm your email address.
          </Text>
          <Section className=" text-center">
            <Button
              href={verification_link}
              className="text-xl font-bold p-4 bg-yellow-500 text-black font-sans rounded-full "
            >
              Verify Email
            </Button>
          </Section>
          <Text key="ins1" className="text-xl font-sans">
            If the button above doesn't work, copy and paste the following URL
            into your browser:
          </Text>{" "}
          <Section className="text-center">
            <Text className="text-xl font-sans ">{verification_link}</Text>
          </Section>
          <Text className="text-xl font-sans ">
            Please note that this verification link is valid for the next 15
            minutes.{" "}
          </Text>
          <hr />
          <Text className={"text-xl font-sans"}>
              If you have any questions, You may reach us here:
            </Text>
          <br />
          <div className="flex w-full justify-center gap-4">
            <div className="flex flex-row mx-auto gap-4">
              <Text className={"text-lg font-sans flex gap-2"}>
                <a
                  href={`mailto:ask@pointsandperks.com`}
                  style={{ color: "#0000ff" }}
                  className="mt-4"
                >
                  <Img
                    src="https://pointsandperks.ca/static/mail.png"
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
                >
                  {" "}
                  <Img
                    src="https://pointsandperks.ca/static/browser.png"
                    alt="Points and Perks Logo"
                    width={60}
                    height={60}
                    className="place-content-start"
                  />
                </a>
              </Text>
              <Text className={"text-lg font-sans flex gap-2"}>
                <a
                  href="https://maps.app.goo.gl/FohkqgaFKQto7LKd7"
                  style={{ color: "#0000ff" }}
                  className="mt-4"
                >
                  <Img
                    src="https://pointsandperks.ca/static/location.png"
                    alt="Points and Perks Logo"
                    width={60}
                    height={60}
                    className="place-content-start"
                  />
                </a>
              </Text>
            </div>
          </div>
          <br />
          <Text className="text-lg font-sans">
            If you didn't sign up for Point and Perks, please disregard this
            email. Thank you, The Perks and Points Team{" "}
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

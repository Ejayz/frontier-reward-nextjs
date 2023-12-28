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

interface EmailTemplateProps {
  firstName: string;
  last_name: string;
  password: string;
  email: string;
  base_url: string;
}
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";
const EmailTemplate = ({
  firstName = "April Jude",
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
      <Preview>register@pointsandperks-Account created.</Preview>
      <Body className="bg-white">
        <Container className="border border-solid border-[#eaeaea] bg-white rounded my-[40px] mx-auto p-[20px] w-[465px]">
          <Section className="mt-4 text-center">
            <Img
              src={`${baseUrl}/static/logo-nav.png`}
              alt="Points and Perks Logo"
              width={215}
              height={48}
              className="mx-auto "
            />
            <Text className="text-2xl mx-auto font-sans w-full font-bold">
              Welcome {last_name}!
            </Text>
          </Section>
          <p>
            Your account has been created. Please use the following credentials
            to login:
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Password:</strong> {password}
          </p>
          <br />
          <p>
            To login click <a href={`${base_url}`}>here</a>{" "}
          </p>
          <p>
            <strong>Best Regards,</strong>
          </p>
          <p>
            <strong>Perks and Points Team</strong>
          </p>
          <p>
            If you have any questions, please contact us at the following
            contacts:
          </p>
          <p>
            Email us at:{" "}
            <a
              href={`mailto:ask@pointsandperks.com`}
              style={{ color: "#0000ff" }}
            >
              ask@pointsandperks.com
            </a>
          </p>
          <p>
            Call us at:{" "}
            <a href="tel:1-800-123-4567" style={{ color: "#0000ff" }}>
              1-800-123-4567
            </a>
          </p>
          <p>
            Visit our website:{" "}
            <a
              href="http://www.pointsandperks.com"
              style={{ color: "#0000ff" }}
            >
              www.pointsandperks.com
            </a>
          </p>
          <p>
            Visit our dealership:{" "}
            <span style={{ color: "#0000ff" }}>1234 Main St.</span>
          </p>
          <br />
          <h4>
            If you did not register for an account, please disregard or delete
            this email.
          </h4>
          <p>
            Do not reply to this email. This mailbox is not monitored and you
            will not receive a response. For assistance, log in to your account
            and click Help in the top right corner of any page.
          </p>
        </Container>{" "}
      </Body>
    </Tailwind>
  </Html>
);

export default EmailTemplate;

const main = {
  backgroundColor: "#ffffff",
};

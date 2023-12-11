import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  last_name: string;
  password: string;
  email: string;
  vehicle_id: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  last_name,
  password,
  email,
  vehicle_id,
}) => (
  <div>
    <img src="/images/logo.png" alt="Auto Insurance" />
    <h1>Points and Perks</h1>
    <h1>Welcome, {last_name}!</h1>
    <p>
      Your account has been created. Please use the following credentials to
      login:
    </p>
    <p>
      <strong>Email:</strong> {email}
    </p>
    <p>
      <strong>Password:</strong> {password}
    </p>
    <p>
      <strong>
        The following information that is registered in your account :
      </strong>
    </p>
    <p>
      <strong>First Name:</strong> {firstName}
    </p>
    <p>
      <strong>Last Name:</strong> {last_name}
    </p>
    <p>
      <strong>Vehicle ID:</strong> {vehicle_id}
    </p>
    <p>
      <strong>Thank you for registering!</strong>
    </p>
    <p>
      <strong>Best Regards,</strong>
    </p>
    <p>
      <strong>Team</strong>
    </p>
    <p>
      <strong>Auto Insurance</strong>
    </p>
    If you have any questions, please contact us at{" "}
    <a
      href="mailto:
    "
    >
      {" "}
      <strong>
        <em>
          <u>
            <span style={{ color: "#0000ff" }}>Auto Insurance</span>
          </u>
        </em>
      </strong>
    </a>
    . If you did not register for an account, please disregard this email.
  </div>
);

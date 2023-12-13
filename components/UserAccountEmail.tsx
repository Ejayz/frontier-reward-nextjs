import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  last_name: string;
  password: string;
  email: string;
  base_url: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  last_name,
  password,
  email,
  base_url,
}) => (
  <div style={{ color: "black" }}>
    <h1>Points and Perks</h1>
    <h3>Welcome, {last_name}!</h3>
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
    If you have any questions, please contact us at the following contacts:
    <p>
      Email us at:
      <a href={`mailto:ask@pointsandperks.com`}>
        <strong>
          <em>
            <u>
              <span style={{ color: "#0000ff" }}>ask@pointsandperks.com</span>
            </u>
          </em>
        </strong>
      </a>
    </p>
    <p>
      Call us at:
      <strong>
        <em>
          <u>
            <span style={{ color: "#0000ff" }}>1-800-123-4567</span>
          </u>
        </em>
      </strong>
    </p>
    <p>
      Visit our website:
      <strong>
        <em>
          <u>
            <span style={{ color: "#0000ff" }}>www.pointsandperks.com</span>
          </u>
        </em>
      </strong>
    </p>
    <p>
      Visit our delearship:
      <strong>
        <em>
          <u>
            <span style={{ color: "#0000ff" }}>1234 Main St.</span>
          </u>
        </em>
      </strong>
    </p>
    <br />
    <h4>
      {" "}
      If you did not register for an account, please disregard or delete this
      email.
    </h4>
    <p>
      Do not reply to this email. This mailbox is not monitored and you will not
      receive a response. For assistance, log in to your account and click Help
      in the top right corner of any page.
    </p>
  </div>
);

export { EmailTemplate };

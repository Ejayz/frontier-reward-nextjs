"use client";
import styles from "./page.module.css";
import { Button, Form, Image } from "react-bootstrap";
import "../css/signin.css";

export default function Home() {
  return (
    <div className="login-container text-center">
      <Form className="form-signin">
        <Image
          className="mb-4"
          src={"/images/logo.png"}
          height="180"
          alt={""}
        />

        <div className="form-fields">
          <Form.Control
            type="email"
            placeholder="EMAIL"
            onChange={(e) => {}}
            required
          />

          <Form.Control
            type="password"
            placeholder="PASSWORD"
            onChange={(e) => {}}
            required
          />

          <Form.Control.Feedback type="invalid">
            {0 == 0 && <div>000</div>}
          </Form.Control.Feedback>

          <Button variant="dark" type="submit">
            LOG IN
          </Button>
        </div>
      </Form>
    </div>
  );
}

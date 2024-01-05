"use client";

import NavBarGeneral from "@/components/NavBarGeneral";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import LabeledInput from "@/components/LabeledInput";
import * as yup from "yup";
export default function Page() {
  const sendForgotPasswordLink = async (email: string) => {
    const response = await fetch("/api/private/sendForgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await response.json();
    if (data.code == 200) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };
  const validationEmail = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required to login"),
  });

  return (
    <div className="login-page">
      <NavBarGeneral />
      <span className="top-shape"></span>
      <span className="bottom-shape"></span>
      <div className="hero min-h-screen">
        <div className="card w-1/4 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Forgot Password</h2>
            <p>To reset your password , please enter your email address.</p>
            <Formik
              validateOnBlur={true}
              validateOnChange={true}
              validateOnMount={true}
              initialValues={{
                email: "",
              }}
              validationSchema={validationEmail}
              onSubmit={(values) => {
                sendForgotPasswordLink(values.email);
              }}
            >
              {({ errors, touched }) => (
                <Form className="card-body">
                  <div className="form-control">
                    <LabeledInput
                      field_name="email"
                      type="email"
                      label="Email Address"
                      placeholder="Email Address"
                      className="input input-bordered text-black text-base text-center"
                      errors={errors.email}
                      touched={touched.email}
                      classes="text-error"
                    />
                  </div>
                  <label className="label">
                    <a
                      href="/"
                      className="label-text-alt link underline link-hover"
                    >
                      Login
                    </a>
                  </label>
                  <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary">
                      Request Forgot Password Link
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

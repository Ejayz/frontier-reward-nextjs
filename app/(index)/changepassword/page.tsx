"use client";

import { useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import NavBarGeneral from "@/components/NavBarGeneral";
import Link from "next/link";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import NormalInput from "@/components/NormalInput";
import NormalInputShowPassword from "@/components/NormalInputShowPassword";
import { toast } from "react-toastify";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputShowPassword from "@/components/LabeledInputShowPassword";
export default function Page() {
  const param = useSearchParams() as URLSearchParams;
  const SignupValidation = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password should atleast be 8 character long.")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*.]/,
        "Password must contain at least one special character"
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Repeat Password is required"),
  });

  const updatePassword = async (values: any) => {
    const body = JSON.stringify({
      password: values.password,
      token: param.get("token"),
    });
    const response = await fetch("/api/private/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const data = await response.json();
    if (data.code == 200) {
      toast.success(data.message);
      setTimeout(() => {
        open("/", "_blank");
        setTimeout(() => {
          window.close();
        }, 200);
      }, 1000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="login-page">
      <NavBarGeneral />
      <span className="top-shape"></span>
      <span className="bottom-shape"></span>
      <div className="hero min-h-screen">
        <div className="card w-1/4 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Change Account Password</h2>
            <p>Please enter your new password below.</p>
            <Formik
              validateOnBlur={true}
              validateOnChange={true}
              validateOnMount={true}
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignupValidation}
              onSubmit={(values) => {
                updatePassword(values);
              }}
            >
              {({ errors, touched }) => (
                <Form className="card-body">
                  <div className="form-control">
                    <LabeledInput
                      field_name="password"
                      type="password"
                      label="Password"
                      placeholder="New Password"
                      className="input input-bordered text-black text-base text-center"
                      errors={errors.password}
                      touched={touched.password}
                      classes="text-error"
                    />
                  </div>
                  <div className="form-control">
                    <LabeledInputShowPassword
                      field_name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      className="input input-bordered text-black text-base text-center"
                      errors={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      classes="text-error"
                    />
                  </div>
                  <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary">
                      Change Password
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

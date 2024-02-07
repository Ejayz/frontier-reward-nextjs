"use client";

import NormalInput from "@/components/NormalInput";
import NormalInputShowPassword from "@/components/NormalInputShowPassword";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import Background from "../login-bg.png";
import Image from "next/image";
export default function Page() {
  const data = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    async function init() {
      console.log(data?.get("error"));
      if (data?.get("error") == "401") {
        toast.error("To view previous page please login.");
      }
    }
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    const response = await fetch("/api/private/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response;
  };

  const nav = useRouter();
  const validateLogin = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required to login"),
    password: yup.string().required("Password is required"),
  });

  return (
    <div
      className="login-page"
      style={{ backgroundImage: "url(" + Background + ")" }}
    >
      <span className="top-shape"></span>
      <span className="bottom-shape"></span>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-center">
            <div className="w-60">
              <Image src="/images/logo.png" width={642} height={620} alt="" />
            </div>
          </div>
          <div className="card flex-shrink-0 w-96 max-w-sm shadow-2xl bg-yellow-400">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={validateLogin}
              onSubmit={async (values) => {
                const isLoggedIn = await login(values.email, values.password);
                const data = await isLoggedIn.json();
                setIsSubmitting(false);
                if (isLoggedIn.ok) {
                  toast.success(data.message);
                  if (
                    data.token.is_email_verified == false ||
                    data.token.password_change_at == false
                  ) {
                    toast.error("Please verify your email first.");
                    nav.push("/verifyemail");
                  } else if (data.token.role == 1) {
                    nav.push("/superadmin/dashboard");
                  } else if (data.token.role == 2) {
                    nav.push("/admin/dashboard");
                  } else if (data.token.role == 3) {
                    nav.push("/salesperson/dashboard");
                  } else if (data.token.role == 4) {
                    nav.push("/customer/dashboard");
                  } else {
                    toast.error(
                      "It seems this account has invalid role. Please contact or visit our office about this matter."
                    );
                  }
                } else {
                  toast.error(data.message);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="card-body">
                  <div className="form-control">
                    <NormalInput
                      field_name="email"
                      type="email"
                      placeholder="Email"
                      className="input input-bordered text-black text-base text-center"
                      errors={errors.email}
                      touched={touched.email}
                      classes="text-error"
                    />
                  </div>
                  <div className="form-control">
                    <NormalInputShowPassword
                      field_name="password"
                      type="password"
                      placeholder="Password"
                      className="input input-bordered text-black text-base text-center"
                      errors={errors.password}
                      touched={touched.password}
                      classes="text-error"
                    />
                    <label className="label">
                      <a
                        href="/forgotpassword"
                        className="label-text-alt link link-hover"
                      >
                        Forgot password?
                      </a>
                    </label>
                  </div>
                  <div className="form-control mt-6">
                    {isSubmitting ? (
                      <button className="btn btn-disabled w-full">
                        Logging in...
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary w-full">
                        Login
                      </button>
                    )}
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

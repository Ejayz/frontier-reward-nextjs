"use client";

import NormalInput from "@/components/NormalInput";
import useAuthenticate from "@/hooks/useAuthenticate";
import { Form, Formik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
export default function page() {
  const data = useSearchParams();
  useEffect(() => {
    async function init() {
      console.log(data?.get("error"))
      if (data?.get("error") == "401") {
        toast.error("To view previous page please login.");
      }
    }
    init();
  }, []);

  const nav = useRouter();
  const validateLogin = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required to login"),
    password: yup.string().required("Password is required"),
  });

  return (
    <div className="login-page">
      <span className="top-shape"></span>
      <span className="bottom-shape"></span>
      <div className="hero min-h-screen">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-center">
            <div className="w-60">
              <img src="./images/logo.png" />
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
                const isLoggedIn = await useAuthenticate(
                  values.email,
                  values.password
                );
                const data = await isLoggedIn.json();

                if (isLoggedIn.ok) {
                  toast.success(data.message);
                  nav.push("/dashboard");
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
                    <NormalInput
                      field_name="password"
                      type="password"
                      placeholder="Password"
                      className="input input-bordered text-black text-base text-center"
                      errors={errors.password}
                      touched={touched.password}
                      classes="text-error"
                    />
                    <label className="label">
                      <a href="#" className="label-text-alt link link-hover">
                        Forgot password?
                      </a>
                    </label>
                  </div>
                  <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary">
                      Login
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

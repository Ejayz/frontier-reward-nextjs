"use client";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputShowPassword from "@/components/LabeledInputShowPassword";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
export default function Page() {
  const [processing, setProcessing] = useState(false);
  const changePasswordValidation = Yup.object().shape({
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
    repeat_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Repeat Password is required"),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch("/api/private/settingUpdatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: values,
      });
      const data = await response.json();
      if (data.code == 200) {
        toast.success(data.message);
        open("/", "_self");
      } else {
        toast.error(data.message);
      }
    },
  });

  return (
    <div className="w-full h-full pl-10">
      <div className="card w-11/12 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>
          <Formik
            initialValues={{
              password: "",
              repeat_password: "",
            }}
            validationSchema={changePasswordValidation}
            onSubmit={(values: any) => {
              updatePasswordMutation.mutate(
                JSON.stringify({
                  password: values.password,
                })
              );
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <p>Update your password.</p>
                <LabeledInput
                  field_name="password"
                  type="password"
                  placeholder="New Password"
                  className="input input-bordered"
                  errors={errors.password}
                  touched={touched.password}
                  classes="mb-2"
                  label="New Password"
                />
                <LabeledInputShowPassword
                  field_name="repeat_password"
                  type="password"
                  placeholder="Repeat Password"
                  className="input input-bordered"
                  errors={errors.repeat_password}
                  touched={touched.repeat_password}
                  classes="mb-2"
                  label="Repeat Password"
                />
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Change Password</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

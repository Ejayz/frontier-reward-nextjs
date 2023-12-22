"use client";
import { ErrorMessage, Field } from "formik";
import { useState } from "react";
import Image from "next/image";
export default function NormalInputShowPassword({
  field_name,
  placeholder,
  className,
  errors,
  touched,
  classes,
}: any) {
  const [showPassword, setShowPassword] = useState("password");
  return (
    <div className="form-control">
      <div className="join">
        <Field
          name={field_name}
          type={showPassword}
          placeholder={placeholder}
          className={`${className} join-item`}
        />
        <button
          type="button"
          onClick={() => {
            if (showPassword == "text") {
              setShowPassword("password");
            } else {
              setShowPassword("text");
            }
          }}
          className="btn join-item "
        >
          {
            showPassword == "text" ? <p>Hide Password</p> : <p>Show Password</p>
            //  (
            //   <Image
            //     src={"/images/view.png"}
            //     width={500}
            //     height={500}
            //     className="h-12 w-12"
            //     alt={""}
            //   />
            // ) : (
            //   <Image
            //     src={"/images/hidden.png"}
            //     width={500}
            //     height={500}
            //     className="h-12 w-12"
            //     alt={""}
            //   />
            // )
          }
        </button>
      </div>

      {errors && touched ? (
        <div className="alert bg-transparent border-none text-error p-[1px] h-auto my-2 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-2  h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <ErrorMessage
            name={field_name}
            component="div"
            className={`${classes} text-base`}
          />
        </div>
      ) : null}
    </div>
  );
}

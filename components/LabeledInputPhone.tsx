"use client";
import { ErrorMessage, Field } from "formik";
import { PhoneInput } from "react-international-phone";

export default function LabeledInputPhone({
  field_name,
  errors,
  touched,
  label,
  value,
  setFieldValue,
  setPhoneInfo,
}: any) {
  console.log(errors, touched);
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <PhoneInput
        name={field_name}
        defaultCountry="ca"
        value={value}
        onChange={(phone, { country }) => {
          console.log(country)
          setPhoneInfo(country);
          setFieldValue("phone_number", phone);
        }}
      />
      {errors ? (
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
          <span className="text-base">{errors}</span>
        </div>
      ) : null}
    </div>
  );
}

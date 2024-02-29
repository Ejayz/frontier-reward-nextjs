"use client";
import { ErrorMessage, Field } from "formik";

export default function LabeledInput({
  field_name,
  type,
  placeholder,
  className,
  errors,
  touched,
  classes,
  label,
  readOnly,
  datatip
}: any) {
  
  return (
    <div className="form-control">
      <label className="label flex place-content-start gap-2">
        <span className="label-text">{label}</span>
        <div className="tooltip tooltip-right text-base tooltip-info " data-tip={datatip}>
                  <div  className="badge badge-lg w-5 h-5">?</div></div>
      </label>
      <Field
        name={field_name}
        type={type}
        placeholder={placeholder}
        className={className}
      />
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

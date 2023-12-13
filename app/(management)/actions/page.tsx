"use client";
import React, { useRef, useState } from "react";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
import * as yup from "yup";
import LabeledInput from "@/components/LabeledInput";
import { Span } from "next/dist/trace";

import { toast } from "react-toastify";
export default function Page() {
  const [userType, setUserType] = useState("");
  const [processing, setProcessing] = useState(false);
  const CustomerAccountDetail = useRef<FormikProps<any>>(null);
  const modalAddUser = useRef<HTMLInputElement>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const handleUserTypeChange = (event: any) => {
    setUserType(event.target.value);
  };
  const initialValues = {
    name: "",
    description: "",
  };
  const actionValidation = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .matches(/^[^\d]+$/, "Name must not include numbers"),
    description: yup
      .string()
      .required("Description is required")
      .matches(/^[^\d]+$/, "Name must not include numbers"),
  });

  return (
    <div className="pl-10">
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      {/* The button to open modal */}
      <label htmlFor="my_modal_6" className="btn btn-primary ">
        Add Action
      </label>

      <input
        type="checkbox"
        id="my_modal_6"
        onChange={() => {
          setUserType("");
          CustomerAccountDetail.current?.resetForm();
        }}
        ref={modalAddUser}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form method="dialog">
            <label
              htmlFor="my_modal_6"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
            >
              ✕
            </label>
          </form>
          <h3 className="font-bold text-lg">Add Action</h3>
          <Formik
            initialValues={{
              name: "",
              description: "",
              created_at: 11 / 11 / 2021,
              updated_at: 11 / 11 / 2021,
            }}
            validationSchema={actionValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
              let headersList = {
                Accept: "*/*",
                "User-Agent": "Thunder Client (https://www.thunderclient.com)",
                "Content-Type": "application/json",
              };
              let bodyContent = JSON.stringify({
                name: values.name,
                description: values.description,
              });
              let response = await fetch("/api/private/createActions/", {
                method: "POST",
                body: bodyContent,
                headers: headersList,
              });

              console.log("Response:", response);
              if (response.ok) {
                alert("triggered and ok");
              } else {
                alert("triggered and not ok");
              }
              let data = await response.json();
              if (data.code == 200) {
                setProcessing(false);
                toast.success(data.message);
                resetForm();
              } else {
                setProcessing(false);
                toast.error(data.message);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-control bg-white">
                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Name
                    </span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Enter Action Name"
                    className="input input-bordered"
                    name="name"
                  />
                  <ErrorMessage name="name" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <img
                          src="../icons/warning.svg"
                          width={20}
                          height={20}
                          alt="Error Icon"
                          className="error-icon pr-1"
                        />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>

                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Description
                    </span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Enter Action Description"
                    className="input input-bordered"
                    name="description"
                  />
                  <ErrorMessage name="description" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <img
                          src="../icons/warning.svg"
                          width={20}
                          height={20}
                          alt="Error Icon"
                          className="error-icon pr-1"
                        />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                  {/* <ErrorMessage component="span" className="text-red-600" name="description" /> */}
                </div>
                <div className="m-8 " style={{ marginTop: 60 }}>
                  <div className="absolute bottom-6 right-6">
                    <label
                      htmlFor="my_modal_6"
                      className="btn btn-neutral mr-2"
                    >
                      Cancel
                    </label>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                    {/* <button type="submit">Submit</button> */}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className="overflow-x-auto mt-5 text-black">
        <table className="table text-base font-semibold">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="row">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 2 */}
            <tr className="row">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="join">
          <button className="join-item btn btn-outline">Previous page</button>
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="2"
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="3"
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="4"
          />
          <button className="join-item btn btn-outline">Next</button>
        </div>
      </div>
    </div>
  );
}

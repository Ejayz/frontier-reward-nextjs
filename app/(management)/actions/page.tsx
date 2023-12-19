"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

type actionslist = {
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export default function Page() {
  const [userType, setUserType] = useState("");
  const [processing, setProcessing] = useState(false);
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["getPackages"],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/getActions", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });
  const [isModalOpen, setModalOpen] = useState(false);

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
      <label htmlFor="my_modal_6" className="btn btn-primary ">
        Add Action
      </label>

      <input
        type="checkbox"
        id="my_modal_6"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setModalOpen(!isModalOpen)}
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
        enableReinitialize={true}
        initialValues={{
          name: "",
          description: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_exist: true,
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
            created_at: values.created_at,
            updated_at: values.updated_at,
            is_exist: values.is_exist,
          });
          console.log("the content",bodyContent);
          let response = await fetch("/api/private/createActions/", {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          });
s
          let data = await response.json();
          if (data.code === 200) {
            setProcessing(false);
            setModalOpen(false);
            
            resetForm();
            toast.success("Successfully Added Action");
            // Refetch the data to update the table
            refetch();
          } else {
            setProcessing(false);
            toast.error(data.message);
            setModalOpen(false);
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
                <label htmlFor="modaladdaction" className="btn btn-neutral mr-2">
                  Cancel
                </label>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
</div></div>


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
            {isLoading || isFetching ? (
              <tr>
                <td>Loading...</td>
              </tr>
            ) : (
              data.data.map((element: any) => {
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{element.created_at}</td>
                    <td>{element.updated_at}</td>
                    <td>
                      <div className="flex">
                        <button className="btn btn-sm btn-info mr-2">
                          <img
                            src="../icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </button>
                        <button className="btn btn-sm btn-error">
                          <img
                            src="../icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                          />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <input
        type="checkbox"
        id="modaleditaction"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setModalOpen(!isModalOpen)}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form method="dialog">
            <label
              htmlFor="modaleditaction"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
            >
              ✕
            </label>
          </form>
          <h3 className="font-bold text-lg">Update Action</h3>
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          description: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_exist: true,
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
            created_at: values.created_at,
            updated_at: values.updated_at,
            is_exist: values.is_exist,
          });
          let response = await fetch("/api/private/createActions/", {
            method: "POST",
            body: bodyContent,
            headers: headersList,
          });

          let data = await response.json();
          if (data.code === 200) {
            setProcessing(false);
            setModalOpen(false);
            resetForm();
            toast.success("Successfully Added Action");
            // Refetch the data to update the table
            refetch();
          } else {
            setProcessing(false);
            toast.error(data.message);
            setModalOpen(false);
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
                <label htmlFor="modaleditaction" className="btn btn-neutral mr-2">
                  Cancel
                </label>
                <button type="submit" className="btn btn-primary">
                  Edit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
</div></div>
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

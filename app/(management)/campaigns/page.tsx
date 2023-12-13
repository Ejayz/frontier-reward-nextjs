"use client";
import React, { useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as yup from "yup";
export default function Page() {
  const [userType, setUserType] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const handleUserTypeChange = (event: any) => {
    setUserType(event.target.value);
  };

  const initialValues = {
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  };
  const campaignValidation = yup.object().shape({
    name: yup.string().required("Name is required").matches(/^[^\d]+$/, 'Name must not include numbers'),
    description: yup.string().required("Description is required").matches(/^[^\d]+$/, 'Name must not include numbers'),
    start_date: yup.date().required("Start Date is required"),
    end_date: yup.date().required("End Date is required"),
  });
  return (
    <div className="pl-10">
     <label htmlFor="my_modal_6" className="btn btn-primary ">Add Campaign</label>
     <input type="checkbox" id="my_modal_6" className="modal-toggle" />
<div className="modal" role="dialog">
  <div className="modal-box">
  <form method="dialog">
  <label htmlFor="my_modal_6"className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ">✕</label>
          
  </form>
  <h3 className="font-bold text-lg">Add Campaign</h3>
  <Formik
  initialValues={
    {
      name: "",
      description: "",
    }
  }
  validationSchema={campaignValidation}
  
  onSubmit={(values, actions) => {
    console.log(values);
  }}
  >{({ errors, touched }) => (
    <Form>
          <div className="form-control bg-white">
         
<label className="label">
              <span className="label-text text-base font-semibold">Name</span>
            </label>
            <Field
              type="text"
              placeholder="Enter Campaign Name"
              className="input input-bordered"
              name="name"
            /> 
             <ErrorMessage name="name" className="flex">
      {(msg) => (
        <div className="text-red-600 flex">
          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
          {msg}
        </div>
      )}
    </ErrorMessage>

<label className="label">
              <span className="label-text text-base font-semibold">Description</span>
            </label>
            <Field
              type="text"
              placeholder="Enter Campaign Description"
              className="input input-bordered"
              name="description"
            /> 
             <ErrorMessage name="description" className="flex">
      {(msg) => (
        <div className="text-red-600 flex">
          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
          {msg}
        </div>
      )}
    </ErrorMessage>
        {/* <ErrorMessage component="span" className="text-red-600" name="description" /> */}
<label className="label">
              <span className="label-text text-base font-semibold">Start Date</span>
            </label>
            <Field
              type="date"
              placeholder="Enter Campaign Start Date"
              className="input input-bordered"
              name="start_date"
            /> 
             <ErrorMessage name="start_date" className="flex">
      {(msg) => (
        <div className="text-red-600 flex">
          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
          {msg}
          </div>
      )}
    </ErrorMessage>
<label className="label">
              <span className="label-text text-base font-semibold">End Date</span>
            </label>
            <Field
              type="date"
              placeholder="Enter Campaign End Date"
              className="input input-bordered"
              name="end_date"
            /> 
             <ErrorMessage name="end_date" className="flex">
      {(msg) => (
        <div className="text-red-600 flex">
          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
          {msg}
          </div>
      )}
    </ErrorMessage>
          </div>
          </Form>
  )}
          </Formik>
          <div className="m-8 " style={{ marginTop: 60 }}>
            <div className="absolute bottom-6 right-6">
              <label  htmlFor="my_modal_6" className="btn btn-neutral mr-2" >Cancel</label>
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
  </div>
</div>

      <div className="overflow-x-auto mt-5 text-black">
        <table className="table text-base font-semibold">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
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
              <td>date</td>
              <td>dates</td>

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
              <td>date</td>
              <td>dates</td>
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
              <td>date</td>
              <td>dates</td>
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
              <td>date</td>
              <td>dates</td>
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
              <td>date</td>
              <td>dates</td>
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
              <td>date</td>
              <td>dates</td>
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
              <td>date</td>
              <td>dates</td>
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
              <td>date</td>
              <td>dates</td>
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

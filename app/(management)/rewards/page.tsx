"use client";
import React, { useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as yup from "yup";
export default function Page() {
  const [rewardType, setrewardType] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const handleUserTypeChange = (event: any) => {
    setrewardType(event.target.value);
  };

  const initialValues = {
    type: "",
    quantity: "",
    cost: "",
    name: "",
    description : "",
    percentage: "",
    points : "",

  };

  const rewardsValidation = yup.object().shape({
    type: yup.string().required("Type is required"),
    quantity: yup.number().required("Quantity is required"),
    cost: yup.number().required("Cost is required"),
    name: yup.string().required("Name is required").matches(/^[^\d]+$/, 'Name must not include numbers'),
    description: yup.string().required("Description is required") .matches(/^[^\d]+$/, 'Name must not include numbers'),
    percentage: yup.string().required("Percentage is required"),
    points: yup.number().required("Points is required"),
  });

  return (
    <div className="pl-10">
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <label htmlFor="my_modal_6" className="btn btn-primary ">Add Reward</label>
      {/* The button to open modal */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
<div className="modal" role="dialog">
  <div className="modal-box">
  <form method="dialog">
  <label htmlFor="my_modal_6"className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ">✕</label>
          
  </form>
  <h3 className="font-bold text-lg">Add Reward</h3>
  <label className="label">
    <span className="label-text text-base font-semibold">Type</span>
  </label>
  <select className="select select-bordered w-full max-w-xs"   value={rewardType} onChange={handleUserTypeChange}>
    <option disabled selected>
      Select Type
    </option>
    <option value="Item">Item</option>
    <option value="Discount">Discount</option>
    <option value="Points">Points</option>
  </select>

  {rewardType === "Item" && (
              <Formik
                initialValues={{
                  quantity: "",
                  cost: "",
                  name: "",
                  description: "",
                }}
                validationSchema={rewardsValidation}
                onSubmit={(values: any) => {
                  console.log(values);
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <label className="label">
                      <span className="label-text text-base font-semibold">Quantity</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Quantity"
                      className="input input-bordered"
                      name="quantity"
                    />
                    <ErrorMessage name="quantity" className="flex">
                      {(msg) => (
                        <div className="text-red-600 flex">
                          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <label className="label">
                      <span className="label-text text-base font-semibold">Cost</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Cost"
                      className="input input-bordered"
                      name="cost"
                    />
                    <ErrorMessage name="cost" className="flex">
                      {(msg) => (
                        <div className="text-red-600 flex">
                           <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <label className="label">
                      <span className="label-text text-base font-semibold">Name</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Name"
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
                      placeholder="Enter Reward Description"
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
                  </Form>
                )}
              </Formik>
            )}

{rewardType === "Discount" && (
              <Formik
                initialValues={{
                  percentage: "",
                  quantity: "",
                  cost: "",
                  name: "",
                  description: "",
                }}
                validationSchema={rewardsValidation}
                onSubmit={(values: any) => {
                  console.log(values);
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <label className="label">
                      <span className="label-text text-base font-semibold">Percentage</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Percentage"
                      className="input input-bordered"
                      name="quantity"
                    />
                    <ErrorMessage name="quantity" className="flex">
                      {(msg) => (
                        <div className="text-red-600 flex">
                          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <label className="label">
                      <span className="label-text text-base font-semibold">Cost</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Cost"
                      className="input input-bordered"
                      name="cost"
                    />
                    <ErrorMessage name="cost" className="flex">
                      {(msg) => (
                        <div className="text-red-600 flex">
                           <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <label className="label">
                      <span className="label-text text-base font-semibold">Name</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Name"
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
                      placeholder="Enter Reward Description"
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
                  </Form>
                )}
              </Formik>
            )}

{rewardType === "Points" && (
              <Formik
                initialValues={{
                  points: "",
                  name: "",
                  description: "",
                }}
                validationSchema={rewardsValidation}
                onSubmit={(values: any) => {
                  console.log(values);
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <label className="label">
                      <span className="label-text text-base font-semibold">Points</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Points"
                      className="input input-bordered"
                      name="quantity"
                    />
                    <ErrorMessage name="quantity" className="flex">
                      {(msg) => (
                        <div className="text-red-600 flex">
                          <img src="../icons/warning.svg" width={20} height={20} alt="Error Icon" className="error-icon pr-1" />
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>

                    <label className="label">
                      <span className="label-text text-base font-semibold">Name</span>
                    </label>
                    <Field
                      type="text"
                      placeholder="Enter Reward Name"
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
                      placeholder="Enter Reward Description"
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
                  </Form>
                )}
              </Formik>
            )}
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
              <th>Type</th>
              <th>QTY</th>
              <th>Cost</th>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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
              <td>bliea</td>
              <td>bliea</td>
              <td>bliea</td>
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

"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type rewardslist = {
  name: string;
  description: string;
  type: string;
  quantity: string;
  cost: string;
  percentage: string;
  points: string;
  created_at: string;
  updated_at: string;
};

export default function Page() {
  const [rewardType, setrewardType] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const handleUserTypeChange = (event: any) => {
    setrewardType(event.target.value);
  };
  const myDiv = document.getElementById("mydiv");

  const [processing, setProcessing] = useState(false);
  const createActionRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchRewardsPagination();
  }, [page]);

  const {
    data: DataRewardsPagination,
    isFetching,
    isLoading,
    refetch: RefetchRewardsPagination,
  } = useQuery({
    queryKey: ["getRewardsPagination", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getRewards?page=${page}`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (!response.ok) {
        showToast({
          status: "error",
          message: data.message,
        });
      }
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });
  
  
  const createRewardMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch(`/api/private/createRewards/`, {
        method: "POST",
        body: values,
        headers: headersList,
      });

      return response.json();
    },
    onSuccess: async (data:any) => {
      setPage(1);
      queryClient.invalidateQueries({
        queryKey: ["getRewardsPagination"],
      });
      console.log(data);

      showToast({
        status: "success",
        message: "Rewards Created Successfully",
      });
      
      RefetchRewardsPagination();
      setProcessing(false);
      createActionRef.current?.resetForm();
      setModalOpen(false);
    },
    onError: async (error: any) => {
      console.log(error);
      showToast({
        status: "error",
        message: "Something went wrong",
      });
      setProcessing(false);

      setModalOpen(false);
    },
  });
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);

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
      <input type="checkbox" id="my_modal_6" className="modal-toggle"  checked={isModalOpen}
        onChange={() => setModalOpen(!isModalOpen)} />
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
    <option value="select type" selected>
      Select Type
    </option>
    <option value="Item">Item</option>
    <option value="Discount">Discount</option>
    <option value="Points">Points</option>
  </select>

  {rewardType === "Item" && (
              <Formik
                initialValues={{
                  type: "Item",
                  quantity: "",
                  cost: "",
                  name: "",
                  description: "",
                  created_at: new Date().toUTCString(),
                  updated_at: new Date().toUTCString(),
                  is_exist: true,
                }}
                ref={createActionRef}
                validationSchema={rewardsValidation}
                onSubmit={async (values, { resetForm }) => {
                  console.log("Form submitted with values:", values);
                  setProcessing(true);
                  resetForm();
                  let bodyContent = JSON.stringify({
                    name: values.name,
                    description: values.description,
                    created_at: values.created_at,
                    updated_at: values.updated_at,
                    is_exist: values.is_exist,
                    cost: values.cost,
                    quantity: values.quantity,
                    type: values.type,

                  });
                  createRewardMutation.mutate(bodyContent);
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
                  </div>
                </div>
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
                  </div>
                </div>
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
                  </div>
                </div>
                  </Form>
                )}
              </Formik>
            )}

  </div>
</div>

      <div className="overflow-x-auto mt-5 text-black">
      <table className="table  text-base font-semibold text-center">
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
            {isLoading ? (
              <tr className="text-center">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              DataRewardsPagination.data.map((element: any) => {
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{element.type}</td>
                    <td>{element.quantity}</td>
                    <td>{element.cost}</td>
<td>{new Date(element.created_at).toLocaleDateString()}</td>
<td>{new Date(element.updated_at).toLocaleDateString()}</td>

                    <td className="flex">
                      <div className="flex mx-auto">
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
        <div className="w-11/12 flex mx-auto">
          <div className="join mx-auto">
            <button
              onClick={() => {
                if (page !== 0) {
                  const newPage = page - 1;
                  setPage(newPage);
                }
              }}
              className="join-item btn"
            >
              «
            </button>
            <button className="join-item btn">
              {isFetching ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                `Page ${page}`
              )}
            </button>
            <button
              onClick={() => {
                if (DataRewardsPagination.data.length >= 7) {
                  const newPage = page + 1;
                  setPage(newPage);
                }
              }}
              className="join-item btn"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

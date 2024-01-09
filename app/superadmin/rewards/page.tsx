"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import {
  QueryClient,
  dataTagSymbol,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { act } from "react-dom/test-utils";
import LabeledSelectInput from "@/components/LabeledSelectInput";

type Element = {
  name: string;
  description: string;
  reward_type_id: number;
  quantity: number;
};

export default function Page() {
  const myDiv = document.getElementById("mydiv");

  const [processing, setProcessing] = useState(false);
  const createActionRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchActionPagination();
  }, [page]);

  const {
    data: DataActionPagination,
    isFetching: isFetchingActionPagination,
    isLoading: isLoadingActionPagination,
    refetch: RefetchActionPagination,
  } = useQuery({
    queryKey: ["getActionsPagination", page],
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
  const {
    data: DataRewardTypePagination,
    isFetching: isFetchingRewardTypePagination,
    isLoading: isLoadingRewardTypePagination,
    refetch: RefetchRewardTypePagination,
  } = useQuery({
    queryKey: ["getRewardType", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getRewardType`, {
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

  const createActionMutation = useMutation({
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
    onSuccess: async (data: any) => {
      setPage(1);
      queryClient.invalidateQueries({
        queryKey: ["getActionsPagination"],
      });
      console.log(data);

      showToast({
        status: "success",
        message: "Action Created Successfully",
      });

      RefetchActionPagination();
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

  const actionValidation = yup.object().shape({
    reward_type_id: yup.string().required("Type is required"),
    quantity: yup.number().required("Quantity is required"),
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
  });

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [rowDataToEdit, setRowDataToEdit] = useState<any | null>(null);

  // ... other functions ...
  const initialValues = {
    name: rowDataToEdit ? rowDataToEdit.name || null : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    // ... add other fields as needed ...
  };
  const handleEditClick = (rowData: any) => {

    console.log("Edit clicked for row:", rowData);
    setRowDataToEdit(rowData);
    setEditModalOpen(true);
  };

  useEffect(() => {
    console.log("Row data updated:", rowDataToEdit);
    if (rowDataToEdit) {
      createActionRef.current?.setValues({
        name: rowDataToEdit.name,
        description: rowDataToEdit.description,
        quantity: rowDataToEdit.quantity,
        reward_type_id: rowDataToEdit.reward_type_id,

        // ... add other fields as needed ...
      });
    }
  }, [rowDataToEdit]);

  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);

    setEditModalOpen(false);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;
    console.log(newValue);
    setSelectedValue(newValue);
    createActionRef.current?.setFieldValue("reward_type_id", newValue);
  };

  return (
    <div className="pl-10">
      <label htmlFor="my_modal_6" className="btn btn-primary ">
        Add Rewards
      </label>
      {/* add modal */}
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
          {/* {isLoadingRewardTypePagination ? (
    <p>Loading...</p>
  ) : ( */}
          <Formik
            initialValues={{
              quantity: "",

              reward_type_id: "",
              name: "",
              description: "",
              created_at: new Date().toISOString(),
            }}
            innerRef={createActionRef}
            validationSchema={actionValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
              resetForm();
              const quantityAsInt = parseInt(values.quantity, 10);


              let bodyContent = JSON.stringify({
                quantity: quantityAsInt,
                reward_type_id: values.reward_type_id,
                name: values.name,
                description: values.description,
                created_at: values.created_at,
              });
              createActionMutation.mutate(bodyContent);
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <select
                  name="reward_type_id"
                  className="select select-bordered w-full max-w-xs font-semibold text-base"
                  id=""
                  onChange={handleSelectChange}
                  value={values.reward_type_id}
                >
                  <option disabled value="">
                    Select Reward Type
                  </option>
                  {DataRewardTypePagination?.data.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Quantity
                  </span>
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
                    Name
                  </span>
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
                  placeholder="Enter Reward Description"
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
          {/* )} */}
        </div>
      </div>

      {/* edit modal */}
      {/* <input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setModalOpen(!isModalOpen)}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form method="dialog">
            <label
              htmlFor="my_modal_7"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
            >
              ✕
            </label>
          </form>
          <h3 className="font-bold text-lg">Edit Action</h3>
       
          <Formik
initialValues={initialValues}
enableReinitialize={true}
onSubmit={onSubmit}>
              
             
                  <Form>

              let bodyContent = JSON.stringify({
                quantity: quantityAsInt,
                type: values.type,
                name: values.name,
                description: values.description,
                created_at: values.created_at,
                updated_at: values.updated_at,
              });
              createActionMutation.mutate(bodyContent);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <select
                  name="rewardtype"
                  className="select select-bordered w-full max-w-xs font-semibold text-base"
                  onChange={(e) => setPage(Number(e.target.value))}
                >
                  {DataRewardTypePagination?.data.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Quantity
                  </span>
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
                    Name
                  </span>
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
                  placeholder="Enter Reward Description"
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
                <div className="m-8 " style={{ marginTop: 60 }}>
                  <div className="absolute bottom-6 right-6">
                    <label
                      htmlFor="my_modal_7"
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
          {/* )} */}
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
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetchingActionPagination ? (
              <tr className="text-center">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              DataActionPagination.data.map((element: any) => {
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{element.type}</td>
                    <td>{element.quantity}</td>
                    <td>{new Date(element.created_at).toLocaleDateString()}</td>
                    <td>{new Date(element.updated_at).toLocaleDateString()}</td>

                    <td className="flex">
                      <div className="flex mx-auto">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                          onClick={() => handleEditClick(element)}
                        >
                          <img
                            src="../icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
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
              {isFetchingActionPagination ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                `Page ${page}`
              )}
            </button>
            <button
              onClick={() => {
                if (DataActionPagination.data.length >= 7) {
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

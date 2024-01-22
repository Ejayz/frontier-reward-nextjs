"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import Image from "next/image";
type Element = {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  updated_at: string;
  deleted_at: string;
  is_exist: boolean;
  removed_date: string;
  id: number;
};

export default function Page() {
  const myDiv = document.getElementById("mydiv");

  const [processing, setProcessing] = useState(false);
  const createCampaignRef = useRef<FormikProps<any>>(null);
  const editCampaignRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchCampaignPagination();
  }, [page]);

  const {
    data: DataCampaignPagination,
    isFetching,
    isLoading,
    refetch: RefetchCampaignPagination,
  } = useQuery({
    queryKey: ["getCampaignPagination", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getCampaigns?page=${page}`, {
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

  const createCampaignMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch(`/api/private/createCampaigns/`, {
        method: "POST",
        body: values,
        headers: headersList,
      });

      return response.json();
    },
    onSuccess: async (data: any) => {
      setPage(1);
      queryClient.invalidateQueries({
        queryKey: ["getCampaignPagination"],
      });
      console.log(data);
      if (data.code == 201) {
        showToast({
          status: "success",
          message: "Campaign Created Successfully",
        });

        RefetchCampaignPagination();
        setProcessing(false);
        createCampaignRef.current?.resetForm();
        setModalOpen(false);
      } else {
        showToast({
          status: "error",
          message: "Something went wrong",
        });
        setProcessing(false);

        setModalOpen(false);
      }
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
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  const campaignValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    start_date: yup.date().required("Start Date is required"),
    end_date: yup.date().required("End Date is required"),
  });
  
  const [rowDataToEdit, setRowDataToEdit] = useState<Element | null>(null);
  // ... other functions ...
  const UpdateinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    start_date: rowDataToEdit ? new Date(rowDataToEdit.start_date).toLocaleDateString() : "",
    end_date: rowDataToEdit ? new Date(rowDataToEdit.end_date).toLocaleDateString() : "",
    id: rowDataToEdit ? rowDataToEdit.id : 0,
    updated_at: new Date(),
    is_exist: 0,
    // ... add other fields as needed ...
  };
  
  const handleEditClick = (rowData: Element) => {
    console.log("Edit clicked for row:", rowData);
    setRowDataToEdit(rowData);
    setEditModalOpen(false);
  };
  const handleUpdateAction = useCallback(
    async (values: any) => {
      setProcessing(true);
      setEditModalOpen(false);
      const headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json',
      };
  
      try {
        console.log("the values are: ",values);
        const response = await fetch(`/api/private/editCampaign/`, {
          method: 'POST',
         
          body: JSON.stringify(values), 
          headers: headersList,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
  
        showToast({
          status: 'success',
          message: 'Campaign Updated Successfully',
        
        });
        RefetchCampaignPagination();
        setProcessing(false);
        editCampaignRef.current?.resetForm();
        setEditModalOpen(false);
      } catch (error) {
        showToast({
          status: 'error',
          message: 'Something went wrong',
        });
        setProcessing(false);
        setEditModalOpen(false);
        console.error(error);
      }
    },
    [setProcessing, showToast,setEditModalOpen, RefetchCampaignPagination, editCampaignRef]
  );

  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleUpdateAction(values);
    setEditModalOpen(false);  
  };  


  const RemoveinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    start_date: rowDataToEdit && rowDataToEdit.start_date
      ? new Date(rowDataToEdit.start_date)
      : "",
    end_date: rowDataToEdit && rowDataToEdit.end_date
      ? new Date(rowDataToEdit.end_date)
      : "",
    id: rowDataToEdit ? rowDataToEdit.id : 0,
    removed_at : new Date(),
    is_exist: rowDataToEdit ? rowDataToEdit.is_exist : 0,
  };
  const handleRemoveClick = (rowData: Element) => {
    console.log("Edit clicked for row:", rowData);
    setRowDataToEdit(rowData);
    setRemoveModalOpen(false);
  };
  const handleRemoveAction = useCallback(
    async (values: any) => {
      setProcessing(true);
      setRemoveModalOpen(false);
      const headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json',
      };
  
      try {
        console.log("the values are: ",values);
        const response = await fetch(`/api/private/removeCampaign/`, {
          method: 'POST',
          body: JSON.stringify(values), 
          headers: headersList,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
  
        showToast({
          status: 'success',
          message: 'Campaign Deleted Successfully',
        
        });
        RefetchCampaignPagination();
        setProcessing(false);
        editCampaignRef.current?.resetForm();
        setRemoveModalOpen(false);
      } catch (error) {
        showToast({
          status: 'error',
          message: 'Something went wrong',
        });
        setProcessing(false);
        setRemoveModalOpen(false);
        console.error(error);
      }
    },
    [setProcessing, showToast,setRemoveModalOpen, RefetchCampaignPagination, editCampaignRef]
  );

  
  const onSubmitRemove = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleRemoveAction(values);
    setModalOpen(false);  
  };  

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Add one day to exclude yesterday
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];

  return (
    <div className="pl-10">
      {/* add modal */}
      <label htmlFor="my_modal_6" className="btn btn-primary ">
        Add Campaign
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
          <h3 className="font-bold text-lg">Add Campaign</h3>
          <Formik
            initialValues={{
              name: "",
              description: "",
              start_date: "",
              end_date: "",
              is_exist: true,
              created_at: new Date(),
            }}
            ref={createCampaignRef}
            validationSchema={campaignValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
              resetForm();
              values.start_date = values.start_date;
              values.end_date = values.end_date;
              let bodyContent = JSON.stringify({
                name: values.name,
                description: values.description,
                start_date: values.start_date,
                end_date: values.end_date,
                created_at: values.created_at,
                is_exist: values.is_exist,
              });
              createCampaignMutation.mutate(bodyContent);
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
                    placeholder="Enter Campaign Name"
                    className="input input-bordered"
                    name="name"
                  />
                  <ErrorMessage name="name" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
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
                    placeholder="Enter Campaign Description"
                    className="input input-bordered"
                    name="description"
                  />
                  <ErrorMessage name="description" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
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
                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Start Date
                    </span>
                  </label>
                  <Field
  type="date"
  id="start_date"
  name="start_date"
  className={`input input-bordered ${
    touched.start_date && errors.start_date ? "input-error" : ""
  }`}
  min={formattedCurrentDate} // Set min attribute to today's date
/>
                  <ErrorMessage name="start_date" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
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
                      End Date
                    </span>
                  </label>
                  <Field
          type="date"
          id="end_date"
          name="end_date"
          className={`input input-bordered ${
            touched.end_date && errors.end_date ? "input-error" : ""
          }`}
          min={formattedCurrentDate} // Set min attribute to today's date
        />
                  <ErrorMessage name="end_date" className="flex"> 
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
                          width={20}
                          height={20}
                          alt="Error Icon"
                          className="error-icon pr-1"
                        />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
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
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

{/* edit modal */}

<input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={isEditModalOpen}
        onChange={() => setEditModalOpen(!isEditModalOpen)}
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
          <h3 className="font-bold text-lg">Edit Campaign</h3>
          <Formik
             initialValues={UpdateinitialValues}
             enableReinitialize={true}
             onSubmit={onSubmit}
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
                    placeholder="Enter Campaign Name"
                    className="input input-bordered"
                    name="name"
                  />
                  <ErrorMessage name="name" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
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
                    placeholder="Enter Campaign Description"
                    className="input input-bordered"
                    name="description"
                  />
                  <ErrorMessage name="description" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
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
                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Start Date
                    </span>
                  </label>
                  <Field
          type="date"
          id="start_date"
          name="start_date"
          className={`input input-bordered ${
            touched.start_date && errors.start_date ? "input-error" : ""
          }`}
          min={new Date().toISOString().split('T')[0]}
          value={new Date(UpdateinitialValues.start_date).toLocaleDateString('en-CA')} // Set initial value to today's date 
          readonly = "true"
        />
                  <ErrorMessage name="start_date" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
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
                      End Date
                    </span>
                  </label>
                  <Field
          type="date"
          id="end_date"
          name="end_date"
          className={`input input-bordered ${
            touched.end_date && errors.end_date ? "input-error" : ""
          }`}
          min={new Date().toISOString().split('T')[0]} // Set min attribute to today's date
          value={new Date(UpdateinitialValues.end_date).toLocaleDateString('en-CA')} // Set initial value to today's date 
          readonly = "true"
        />
                  <ErrorMessage name="end_date" className="flex">
                    {(msg) => (
                      <div className="text-red-600 flex">
                        <Image
                          src="/icons/warning.svg"
                          width={20}
                          height={20}
                          alt="Error Icon"
                          className="error-icon pr-1"
                        />
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
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
        </div>
      </div>


{/* delete modal */}
<input type="checkbox" id="my_modal_8"
 checked={isRemoveModalOpen}
        onChange={() => setRemoveModalOpen(!isRemoveModalOpen)}
        className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form method="dialog">
          </form>
          <h3 className="font-bold text-lg">Delete Campaign</h3>
          <Formik
            initialValues={RemoveinitialValues}
            enableReinitialize={true}
            onSubmit={onSubmitRemove}
          >
            <Form>
              <div className="form-control bg-white">
              <label className="label">
    <span className="label-text text-base font-semibold">
      Are you sure you want to delete the following data?
    </span>
  </label>
  <div className="flex">
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Name:
                  </span>
                </label>
                <Field
                  type="text"
                  placeholder="Enter Action Name"
                  className="input border-none"
                  name="name"
                  disabled />
                </div>
                <div className="flex">
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Description:
                  </span>
                </label>
                <Field
                  type="text"
                  placeholder="Enter Action Name"
                  className="input border-none text-black"
                  name="description"
                  disabled />
                </div>
              </div>
              <div className="m-8 " style={{ marginTop: 60 }}>
                <div className="absolute bottom-6 right-6">
                <label
                      htmlFor="my_modal_8"
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
          </Formik>
        </div>
      </div>


      <div className="overflow-x-auto mt-5 text-black">
        <table className="table  text-base font-semibold text-center">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="text-center">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              DataCampaignPagination.data.map((element: any) => {
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{new Date(element.start_date).toLocaleDateString()}</td>
                    <td>{new Date(element.end_date).toLocaleDateString()}</td>

                    <td className="flex">
                      <div className="flex mx-auto">
                        <button className="btn btn-sm btn-accent mr-2">
                          <Image
                            src="/icons/addrewards.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Reward
                        </button>
                        <label htmlFor="my_modal_7" className="btn btn-sm btn-info mr-2"
                        onClick={() => handleEditClick(element)}>
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                        onClick={() => handleRemoveClick(element)}>
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                          />
                          Delete
                        </label>
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
                if (DataCampaignPagination.data.length >= 7) {
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

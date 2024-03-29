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
import { create } from "domain";
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
type RewardActionElement = {
id: number;
quantity: number;
status: string;
action_id: number;
reward_id: number;
campaign_id: number;
updated_at: string;
remove_at: string;
is_exist: number;
created_at: string;
};
export default function Page() {
  const myDiv = document.getElementById("mydiv");

  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);
  const createCampaignRef = useRef<FormikProps<any>>(null);
  const editCampaignRef = useRef<FormikProps<any>>(null);
  const createCampaignRewardRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchCampaignPagination();
  }, [page]);

  // Function to make the ThunderClient request
  const makeThunderClientRequest = async () => {
    try {
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)"
      }

      let response = await fetch("/api/private/cronjobs/", { 
        method: "POST",
        headers: headersList
      });

      let data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Error making ThunderClient request:", error);
    }
  }

  // Use the useEffect hook to trigger the ThunderClient request when the page loads
  useEffect(() => {
    makeThunderClientRequest();
  }, []); // The empty dependency array ensures the effect runs only once, when the component mounts




  const {
    data: DataCampaignPagination,
    isFetching,
    isLoading,
    refetch: RefetchCampaignPagination,
  } = useQuery({
    queryKey: ["getCampaignPagination", page, searchTerm],
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

  const filteredData = (DataCampaignPagination?.data || []).filter(
    (element: Element) =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const [isAddRewardActionModalOpen, setAddRewardActionModalOpen] = useState(false);
  const [isRemoveModalOpenRewardAction, setRemoveModalOpenRewardAction] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState<Element | null>(null);
  const [rowDataToEditPR, setRowDataToEditPR] = useState<RewardActionElement | null>(null);

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
  const handleUpdateCampaign = useCallback(
    async (values: any) => {
      setProcessing(true);
      setEditModalOpen(false);
// Check if the name and description remain the same
if (
  values.name === rowDataToEdit?.name &&
  values.description === rowDataToEdit?.description
) {
  showToast({
    status: 'error',
    message: 'Campaign data is the same, no changes made',
  });

  setProcessing(false);
  return;
}
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
    await handleUpdateCampaign(values);
    setEditModalOpen(false);  
  };  
  return (

    <div className="w-full h-full px-2">
   <div className="w-80">
    <label className="input input-bordered flex items-center gap-2">
      <input
        type="text"
        style={{ width: 300 }}
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="text-lg font-semibold"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4 opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
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
          <h3 className="font-bold text-lg">View Campaign</h3>
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
                    readOnly
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
                    readOnly
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
          readOnly
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
          readOnly
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
                      Back
                    </label>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto w-full h-full mt-5 text-black">
        <table className="table place-content-center table-zebra text-base font-semibold text-center table-sm lg:table-lg">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
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
              filteredData.map((element: any) => {
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>               <td className={`badge ${element.status === 'active' ? 'badge-info' : 'badge-error'}`}>
  {element.status}
</td>
                    <td>{new Date(element.start_date).toLocaleDateString()}</td>
                    <td>{new Date(element.end_date).toLocaleDateString()}</td>

                    <td className="flex">
                      <div className="flex mx-auto">
                       
                        <label htmlFor="my_modal_7" className="btn btn-sm btn-info mr-2"
                        onClick={() => handleEditClick(element)}>
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                            className="hide-icon"
                          />
                          View
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

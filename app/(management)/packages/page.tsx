"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { start } from "repl";

type packages = {
  name: string;
  description: string;
  multiplier: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_exist: boolean;
};

export default function Page() {
  const myDiv = document.getElementById("mydiv");

  const [processing, setProcessing] = useState(false);
  const createCampaignRef = useRef<FormikProps<any>>(null);
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
      let response = await fetch(`/api/private/getRewards/`, {
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
    onSuccess: async (data:any) => {
      setPage(1);
      queryClient.invalidateQueries({
        queryKey: ["getCampaignPagination"],
      });
      console.log(data);

      showToast({
        status: "success",
        message: "Campaign Created Successfully",
      });
      
      RefetchCampaignPagination();
      setProcessing(false);
      createCampaignRef.current?.resetForm();
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

  const campaignValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),

  });

  return (
    <div className="pl-10">
     <label htmlFor="my_modal_6" className="btn btn-primary ">Add Campaign</label>
     <input type="checkbox" id="my_modal_6" className="modal-toggle"    
     checked={isModalOpen}
        onChange={() => setModalOpen(!isModalOpen)} />
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
      start_date: "",
      end_date:"",
      is_exist: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: new Date().toISOString(),

    }
  }
  ref={createCampaignRef}
  validationSchema={campaignValidation}
  onSubmit={async (values, { resetForm }) => {
    console.log("Form submitted with values:", values);
    setProcessing(true);
    resetForm();
    values.start_date = new Date(values.start_date).toISOString();
    values.end_date = new Date(values.end_date).toISOString();
    let bodyContent = JSON.stringify({
      name: values.name,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date,
      created_at: values.created_at,
      updated_at: values.updated_at,
      deleted_at: values.deleted_at,
      is_exist: values.is_exist,
    });
    createCampaignMutation.mutate(bodyContent);
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

      <div className="overflow-x-auto mt-5 text-black">
      <table className="table  text-base font-semibold text-center">
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
<td>{new Date(element.created_at).toLocaleDateString()}</td>
<td>{new Date(element.updated_at).toLocaleDateString()}</td>
                    
                    <td className="flex">
                      <div className="flex mx-auto">
                      <button className="btn btn-sm btn-accent mr-2">
                          <img
                            src="../icons/addrewards.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Reward
                        </button>
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

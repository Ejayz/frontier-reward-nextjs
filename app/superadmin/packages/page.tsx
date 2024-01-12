"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
import Image from "next/image";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { start } from "repl";

type Element = {
  id: number;
  name: string;
  description: string;
  multiplier: number;
  updated_at: string;
};

export default function Page() {
  const myDiv = document.getElementById("mydiv");

  const [processing, setProcessing] = useState(false);
  const createPackageRef = useRef<FormikProps<any>>(null);
  const editPackageRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchPackagesPagination();
  }, [page]);

  const {
    data: DataPackagesPagination,
    isFetching,
    isLoading,
    refetch: RefetchPackagesPagination,
  } = useQuery({
    queryKey: ["getPackagesPagination", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/displayPackages/`, {
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

      let response = await fetch(`/api/private/createPackage/`, {
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

      showToast({
        status: "success",
        message: "Campaign Created Successfully",
      });

      RefetchPackagesPagination();
      setProcessing(false);
      createPackageRef.current?.resetForm();
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
    multiplier: yup.number().required("Multiplier is required"),
  });

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState<Element | null>(null);

  // ... other functions ...
  const initialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    multiplier: rowDataToEdit ? rowDataToEdit.multiplier : "",
    id : rowDataToEdit ? rowDataToEdit.id : 0,
    update_at: new Date().toISOString(),

    // ... add other fields as needed ...
  };
  const handleEditClick = (rowData: Element) => {
    console.log("Edit clicked for row:", rowData);
    setRowDataToEdit(rowData);
    setEditModalOpen(true);
  };
  const handleUpdatePackages = useCallback(
    async (values: any) => {
      setProcessing(true);

      const headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json',
      };
  
      try {
        console.log("the values are: ",values);
        const response = await fetch(`/api/private/editPackage/`, {
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
          message: 'Action Updated Successfully',
        });
        setEditModalOpen(false);
        RefetchPackagesPagination();
        setProcessing(false);
        editPackageRef.current?.resetForm();
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
    [setProcessing, showToast, RefetchPackagesPagination, editPackageRef,setEditModalOpen]
  );

  console.log(DataPackagesPagination);

  return (
    <div className="pl-10">
      <label htmlFor="my_modal_6" className="btn btn-primary ">
        Add Package
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
          <h3 className="font-bold text-lg">Add Package</h3>
          <Formik
            initialValues={{
              name: "",
              description: "",
              multiplier: "",
              created_at: new Date().toISOString(),
            }}
            ref={createPackageRef}
            validationSchema={campaignValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
              resetForm();
              const multiplierTofloat = parseFloat(values.multiplier);
              let bodyContent = JSON.stringify({
                name: values.name,
                description: values.description,
                multiplier: multiplierTofloat,
                created_at: values.created_at,
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
                    placeholder="Enter Package Name"
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
                    placeholder="Enter Package Description"
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

                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Multiplier
                    </span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Enter Package Multiplier"
                    className="input input-bordered"
                    name="multiplier"
                  />
                  <ErrorMessage name="multiplier" className="flex">
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

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
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
          <h3 className="font-bold text-lg">Add Package</h3>
          <Formik
         initialValues={initialValues}
         enableReinitialize={true}
         onSubmit={handleUpdatePackages} 
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
                    placeholder="Enter Package Name"
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
                    placeholder="Enter Package Description"
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

                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Multiplier
                    </span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Enter Package Multiplier"
                    className="input input-bordered"
                    name="multiplier"
                  />
                  <ErrorMessage name="multiplier" className="flex">
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
      <div className="overflow-x-auto mt-5 text-black">
        <table className="table  text-base font-semibold text-center">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Multiplier</th>
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
              DataPackagesPagination.data.map((element: any) => {
                console.log(element);
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{element.multiplier}</td>
                    <td>{new Date(element.created_at).toLocaleDateString()}</td>
                    <td>{new Date(element.updated_at).toLocaleDateString()}</td>

                    <td className="flex">
                      <div className="flex mx-auto">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                          onClick={() => handleEditClick(element)}
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
                        <button className="btn btn-sm btn-error">
                          <Image
                            src="/icons/deleteicon.svg"
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
                if (DataPackagesPagination.data.length >= 7) {
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

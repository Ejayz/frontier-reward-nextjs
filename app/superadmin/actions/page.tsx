"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Image from "next/image";
type Element = {
  id: number;
  name: string;
  description: string;
  updated_at: string;
  is_exist: number;
  removed_at: string;
  // Add other properties as needed
};
export default function Page() {
  const myDiv = document.getElementById("mydiv");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);
  const createActionRef = useRef<FormikProps<any>>(null);
  const editActionRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchActionPagination();
  }, [page]);

  const {
    data: DataActionPagination,
    isFetching,
    isLoading,
    refetch: RefetchActionPagination,
  } = useQuery({
    queryKey: ["getActionsPagination", page, searchTerm],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getActions?page=${page}`, {
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

  const filteredData = (DataActionPagination?.data || []).filter(
    (element: Element) =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    RefetchActionPagination();
  };
// Fetch campaign data using useQuery
const {
  data: DataCampaign,
  isLoading: isCampaignLoading,
  isError: isCampaignError,
} = useQuery({
  queryKey: ["getCampaigns"],
  queryFn: async () => {
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    };
    // Fetch campaign data from the API
    // Adjust the API endpoint and request logic as needed
    const response = await fetch(`/api/private/getCampaignRewardAction`);
    const data = await response.json();

    if (!response.ok) {
      // Handle error if the API request fails
      // Adjust the error handling logic as needed
      throw new Error(data.message || "Failed to fetch campaigns");
    }

    return data;
  },
  // Other options for your use case
});

  const createActionMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch(`/api/private/createActions/`, {
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
      if (data.code == 201) {
        showToast({
          status: "success",
          message: "Action Created Successfully",
        });

        RefetchActionPagination();
        setProcessing(false);
        createActionRef.current?.resetForm();
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
  const actionValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
  });

  const [rowDataToEdit, setRowDataToEdit] = useState<Element | null>(null);

  // ... other functions ...
  const UpdateinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    id:rowDataToEdit? rowDataToEdit.id:0,
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
  
      // Check if the name and description remain the same
      if (
        values.name === rowDataToEdit?.name &&
        values.description === rowDataToEdit?.description
      ) {
        showToast({
          status: 'error',
          message: 'Action data is the same, no changes made',
        });
  
        setProcessing(false);
        return;
      }
      const isDataExisting = DataActionPagination.data.some(
        (element: Element) =>
          element.id !== rowDataToEdit?.id &&
          element.name === values.name &&
          element.description === values.description &&
          element.is_exist === 1
      );
  
      if (isDataExisting) {
        showToast({
          status: 'error',
          message: 'Action with these updated values already exists',
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
        const response = await fetch(`/api/private/editActions/`, {
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
  
        RefetchActionPagination();
        setProcessing(false);
        editActionRef.current?.resetForm();
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
    [setProcessing, showToast, setEditModalOpen, RefetchActionPagination, editActionRef, rowDataToEdit]
  );

  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleUpdateAction(values);
    setEditModalOpen(false);  
  };  

  const RemoveinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    id: rowDataToEdit ? rowDataToEdit.id : 0,
    removed_at: new Date(),
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
        // Check if the action is used in a campaign
        console.log("the values are: ", values);  
  
        const isActionUsedInCampaign = DataCampaign.data.some(
          (campaign: any) => campaign.action_id === values.id && campaign.is_exist === 1
        );
  
        if (isActionUsedInCampaign) {
          showToast({
            status: 'error',
            message: 'This action is currently used and cannot be removed.',
          });
  
          setProcessing(false);
          return;
        }
  
        const response = await fetch(`/api/private/removeActions/`, {
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
          message: 'Action Deleted Successfully',
        });
  
        RefetchActionPagination();
        setProcessing(false);
        editActionRef.current?.resetForm();
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
    [setProcessing, showToast, setRemoveModalOpen, RefetchActionPagination, editActionRef, DataCampaign]
  );
  
  
  const onSubmitRemove = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleRemoveAction(values);
    setModalOpen(false);  
    
  };  
 
  return (
    <div className="w-full h-full px-2"> 

<div className="flex w-full">
      <label htmlFor="my_modal_6" className="btn btn-primary">
    Add Action
  </label>  <div className="ml-auto">
  {/* add modal */}
  <Formik
  initialValues={{ search: "" }}
  onSubmit={(values) => {
    setSearchTerm(values.search);
    // Add logic to trigger the search
  }}
>
  {({ values, handleChange, handleSubmit }) => (
    <form onSubmit={handleSubmit}>
     
    
      <Field
        type="text"
        className="text-lg font-semibold border-2 border-sky-500 rounded-l-lg px-4 py-2 w-80"
        style={{ width: 300 }}
        name="search"
        placeholder="Search..."
        value={values.search}
        onChange={handleChange}
      />
      <button type="submit"  className="text-lg font-semibold border-2 border-sky-500 bg-cyan-500 rounded-r-lg px-4 py-2 w-20"> 
      Search
      </button>
      
      
    

    

    </form>
  )}
</Formik>
      </div>
</div>
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
            initialValues={{
              name: "",
              description: "",
            }}
            ref={createActionRef}
            validationSchema={actionValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
             // Check if the data already exists
  const isDataExisting = DataActionPagination.data.some(
    (element: Element) =>
      element.name === values.name && element.description === values.description &&
      element.is_exist === 1
  );

  if (isDataExisting) {
    showToast({
      status: "error",
      message: "Action with this name and description already exists",
    });

    setProcessing(false);
    return;
  }
              resetForm();
              let bodyContent = JSON.stringify({
                name: values.name,
                description: values.description,
              });
              createActionMutation.mutate(bodyContent);
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
                    placeholder="Enter Action Description"
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
      <input type="checkbox" id="my_modal_7" checked={isEditModalOpen}
        onChange={() => setEditModalOpen(!isEditModalOpen)}
        className="modal-toggle" />
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
            initialValues={UpdateinitialValues}
            enableReinitialize={true}
            onSubmit={onSubmit}
          >
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
                {/* ... add other form fields as needed ... */}
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
                {/* ... add other form fields as needed ... */}
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

          <Formik
            initialValues={RemoveinitialValues}
            enableReinitialize={true}
            onSubmit={onSubmitRemove}
          >
            <Form>
              <div className="form-control bg-white">
              <label className="label text-center">
    <span className="label-text text-base font-semibold">
      Are you sure you want to delete the following data?
    </span>
  </label>
  <div className="flex mb-5">
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
                  readOnly />
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
                  readOnly />
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

      <div className="overflow-x-auto w-full h-full mt-5 text-black">

        <table className="table place-content-center table-zebra text-base font-semibold text-center table-sm lg:table-lg">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
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
                  <tr className="hover" key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td className="flex place-content-center">
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
                            className="hide-icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                        onClick={() => handleRemoveClick(element)}
                        >
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                            className="hide-icon"
                          />
                          Delete
                        </label>
                   
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

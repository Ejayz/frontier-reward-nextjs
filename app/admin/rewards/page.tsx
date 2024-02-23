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
import { act } from "react-dom/test-utils";
import LabeledSelectInput from "@/components/LabeledSelectInput";

type Element = {
  id: number;
  name: string;
  description: string;
  reward_type_id: number;
  quantity: number;
  updated_at: string;
  is_exist: number;
};

export default function Page() {
  const myDiv = document.getElementById("mydiv");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);
  const createRewardRef = useRef<FormikProps<any>>(null);
  const editRewardRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();
  useEffect(() => {
    RefetchRewardPagination();
  }, [page]);

// Fetch campaign data using useQuery
const {
  data: DataPackageReward,
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
    const response = await fetch(`/api/private/getPackageReward`, );
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

  const {
    data: DataRewardPagination,
    isFetching: isFetchingRewardPagination,
    isLoading: isLoadingRewardPagination,
    refetch: RefetchRewardPagination,
  } = useQuery({
    queryKey: ["getRewardsPagination", page, searchTerm],
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

  const filteredData = (DataRewardPagination?.data || []).filter(
    (element: Element) =>
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
    onSuccess: async (data: any) => {
      setPage(1);
      queryClient.invalidateQueries({
        queryKey: ["getRewardsPagination"],
      });
      console.log(data);

      showToast({
        status: "success",
        message: "Reward Created Successfully",
      });

      RefetchRewardPagination();
      setProcessing(false);
      createRewardRef.current?.resetForm();
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
  const {
    data: DataRedeemPagination,
    isFetching: isFetchingRedeemPagination,
    isLoading: isLoadingRedeemPagination,
    refetch: RefetchRedeemPagination,
  } = useQuery({
    queryKey: ["getRedeem", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getRedeem`, {
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
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  const rewardValidation = yup.object().shape({
    reward_type_id: yup.string().required("Type is required"),
    quantity: yup.number().required("Quantity is required"),
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
  });

  const [rowDataToEdit, setRowDataToEdit] = useState<Element | null>(null);

  // ... other functions ...
  const UpdateinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    quantity: rowDataToEdit ? rowDataToEdit.quantity : "",
    reward_type_id: rowDataToEdit ? rowDataToEdit.reward_type_id : "",
    id : rowDataToEdit ? rowDataToEdit.id : 0,
    updated_at: new Date(),
    is_exist: rowDataToEdit ? rowDataToEdit.is_exist : 0,
    // ... add other fields as needed ...
  };
  const handleEditClick = (rowData: Element) => {
    console.log("Edit clicked for row:", rowData);
    setRowDataToEdit(rowData);
    setEditModalOpen(false);
  };

  const handleUpdateReward = useCallback(
    async (values: any) => {
      setProcessing(true);
      setEditModalOpen(false);
    // Check if the name and description remain the same
    if (
      rowDataToEdit &&
      values.name === rowDataToEdit.name &&
      values.description === rowDataToEdit.description &&
      values.quantity === rowDataToEdit.quantity &&
      values.reward_type_id === rowDataToEdit.reward_type_id
      // Add other fields as needed
    ) {
      showToast({
        status: 'error',
        message: 'No changes detected. Data remains the same.',
      });
      setProcessing(false);
      setEditModalOpen(false);
      return; // Do not proceed with the update
    }
    const isDataExisting = DataRewardPagination.data.some(
      (element: Element) =>
        element.id !== rowDataToEdit?.id &&
        element.name === values.name &&
        element.description === values.description &&
        element.reward_type_id === Number(values.reward_type_id) &&
        element.is_exist === 1
    );

    if (isDataExisting) {
      showToast({
        status: 'error',
        message: 'Reward with these updated values already exists',
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
        const response = await fetch(`/api/private/editRewards/`, {
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
          message: 'Reward Updated Successfully',
        
        });
        RefetchRewardPagination();
        setProcessing(false);
        editRewardRef.current?.resetForm();
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
    [setProcessing, showToast,setEditModalOpen, RefetchRewardPagination, editRewardRef,rowDataToEdit]
  );
  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleUpdateReward(values);
    setEditModalOpen(false);  
  };  

  useEffect(() => {
    console.log("Row data updated:", rowDataToEdit);
    if (rowDataToEdit) {
      createRewardRef.current?.setValues({
        name: rowDataToEdit.name,
        description: rowDataToEdit.description,
        quantity: rowDataToEdit.quantity,
        reward_type_id: rowDataToEdit.reward_type_id,

      });
    }
  }, [rowDataToEdit]);

  useEffect(() => {
    console.log("Row data updated for edit:", rowDataToEdit);
    if (rowDataToEdit) {
      editRewardRef.current?.setValues({
        name: rowDataToEdit.name,
        description: rowDataToEdit.description,
        quantity: rowDataToEdit.quantity,
        reward_type_id: rowDataToEdit.reward_type_id,
      });
    }
  }, [rowDataToEdit]);


  
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
  const handleRemoveReward = useCallback(
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
        const isActionUsedInCampaign = DataPackageReward.data.some(
          (element: any) => element.reward_id === values.id && element.is_exist === 1
        );
  
        if (isActionUsedInCampaign) {
          showToast({
            status: 'error',
            message: 'This rewards is currently used and cannot be removed.',
          });
  
          setProcessing(false);
          return;
        }
         try {
          console.log("the values are: ",values);
          const isActionUsedInRedeem = DataRedeemPagination.data.some(
            (element: any) => element.reward_id === values.id && element.is_exist === 1
          );
    
          if (isActionUsedInRedeem) {
            showToast({
              status: 'error',
              message: 'This rewards is currently used and cannot be removed.',
            });
    
            setProcessing(false);
            return;
          }
        const response = await fetch(`/api/private/removeRewards/`, {
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
          message: 'Reward Deleted Successfully',
        
        });
        RefetchRewardPagination();
        setProcessing(false);
        editRewardRef.current?.resetForm();
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
    }
      catch (error) {
        showToast({
          status: 'error',
          message: 'Something went wrong',
        });
        setProcessing(false);
        setRemoveModalOpen(false);
        console.error(error);
      } 
    },
    [setProcessing, showToast,setRemoveModalOpen, RefetchRewardPagination, editRewardRef,rowDataToEdit,DataPackageReward]
  );

  
  const onSubmitRemove = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleRemoveReward(values);
    setModalOpen(false);  
  };  

  return (
    <div className="w-full h-full px-2">
      <div className="flex w-full">
  {/* add modal */}
  <label htmlFor="my_modal_6" className="btn btn-primary">
    Add Reward
  </label>
  <div className="ml-auto">
  {/* add modal */}
  <label className="input input-bordered flex items-center gap-2">
      <input
        type="text"
        className="text-lg font-semibold"
        style={{ width: 300 }}
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-8 h-8 opacity-70"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
      </div>
</div>
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
          <h3 className="font-bold text-lg">Add Reward</h3>
          {/* {isLoadingRewardTypePagination ? (
    <p>Loading...</p>
  ) : ( */}
          <Formik
            initialValues={{
              quantity: "",
              reward_type_id: "",
              name: "",
              description: "",
            }}
            innerRef={createRewardRef}
            validationSchema={rewardValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
              const isDataExisting = DataRewardPagination.data.some(
                (element: Element) =>
                  element.name === values.name && element.description === values.description &&
                  element.is_exist === 1 &&
                  element.reward_type_id === Number(values.reward_type_id)
              );
            
              if (isDataExisting) {
                showToast({
                  status: "error",
                  message: "Reward with this name and description already exists",
                });
            
                setProcessing(false);
                return;
              }
              resetForm();
              const quantityAsInt = parseInt(values.quantity, 10);

              let bodyContent = JSON.stringify({
                quantity: quantityAsInt,
                reward_type_id: values.reward_type_id,
                name: values.name,
                description: values.description,
              });
              createRewardMutation.mutate(bodyContent);
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <select
                  name="reward_type_id"
                  className="select select-bordered w-full max-w-xs font-semibold text-base"
                  id=""
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    console.log("the value is: ",selectedValue);
                    const selectedValueAsInt = parseInt(selectedValue, 10);
                    setFieldValue('reward_type_id', selectedValueAsInt);
                  }}
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
          <h3 className="font-bold text-lg">Edit Reward</h3>
       
          <Formik
initialValues={UpdateinitialValues}
enableReinitialize={true}
innerRef={editRewardRef}
validationSchema={rewardValidation}
onSubmit={onSubmit}>
   {({ errors, touched, values, setFieldValue }) => (
           <Form>
  <select
                  name="reward_type_id"
                  className="select select-bordered w-full max-w-xs font-semibold text-base"
                  id=""
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    console.log("the value is: ",selectedValue);
                    const selectedValueAsInt = parseInt(selectedValue, 10);
                    setFieldValue('reward_type_id', selectedValueAsInt);
                  }}
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
              
        {/* remove modal */}
        
{/* delete modal */}
<input type="checkbox" id="my_modal_8"
 checked={isRemoveModalOpen}
        onChange={() => setRemoveModalOpen(!isRemoveModalOpen)}
        className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <form method="dialog">
          </form>
          <h3 className="font-bold text-lg">Delete Reward</h3>
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
                  placeholder="Enter Reward Name"
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
                  placeholder="Enter Reward Name"
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
        <table className="table table-zebra text-base font-semibold place-content-center text-center table-sm lg:table-lg">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold text-center">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>QTY</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetchingRewardPagination ? (
              <tr className="text-center">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              filteredData.map((element: any) => {
                const rewardType = DataRewardTypePagination?.data.find((item: any) => item.id === parseInt(element.reward_type_id));
               const rewardTypeName = rewardType ? rewardType.name : "Unknown"; // Use a default value if not found
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{rewardTypeName}</td>
                    <td>{element.quantity}</td>

                    <td className="inline place-content-center lg:flex ">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                          onClick={() => handleEditClick(element)}
                        >
                          <Image
                            src="../icons/editicon.svg"
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
                            src="../icons/deleteicon.svg"
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
              {isFetchingRewardPagination ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                `Page ${page}`
              )}
            </button>
            <button
              onClick={() => {
                if (DataRewardPagination.data.length >= 7) {
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
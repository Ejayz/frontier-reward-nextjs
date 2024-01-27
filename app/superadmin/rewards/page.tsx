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
        message: "Reward Created Successfully",
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
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

  const actionValidation = yup.object().shape({
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
    [setProcessing, showToast,setEditModalOpen, RefetchActionPagination, editActionRef]
  );

  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleUpdateReward(values);
    setEditModalOpen(false);  
  };  


  useEffect(() => {
    console.log("Row data updated:", rowDataToEdit);
    if (rowDataToEdit) {
      createActionRef.current?.setValues({
        name: rowDataToEdit.name,
        description: rowDataToEdit.description,
        quantity: rowDataToEdit.quantity,
        reward_type_id: rowDataToEdit.reward_type_id,

      });
    }
  }, [rowDataToEdit]);

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;
    console.log(newValue);
    setSelectedValue(newValue);
    createActionRef.current?.setFieldValue("reward_type_id", newValue);
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
        console.log("the values are: ",values);
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
    [setProcessing, showToast,setRemoveModalOpen, RefetchActionPagination, editActionRef]
  );

  
  const onSubmitRemove = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleRemoveAction(values);
    setModalOpen(false);  
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
              created_at: new Date(),
            }}
            innerRef={createActionRef}
            validationSchema={actionValidation}
            onSubmit={async (values, { resetForm }) => {
              console.log("Form submitted with values:", values);
              setProcessing(true);
              const isDataExisting = DataActionPagination.data.some(
                (element: Element) =>
                  element.name === values.name && element.description === values.description
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
onSubmit={onSubmit}>
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
              <th>Type</th>
              <th>QTY</th>
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
                const rewardType = DataRewardTypePagination?.data.find((item: any) => item.id === parseInt(element.reward_type_id));
               const rewardTypeName = rewardType ? rewardType.name : "Unknown"; // Use a default value if not found
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{rewardTypeName}</td>
                    <td>{element.quantity}</td>

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
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                        onClick={() => handleRemoveClick(element)}
                        >
                          <img
                            src="../icons/deleteicon.svg"
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
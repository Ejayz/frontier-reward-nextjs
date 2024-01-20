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
import Select from 'react-select';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { start } from "repl";
import { tree } from "next/dist/build/templates/app-page";

type Element = {
  id: number;
  package_id: number;
  name: string;
  description: string;
  multiplier: number;
  updated_at: string;
  reward_id: number;
  created_at: string;
};

export default function Page() {

  const [processing, setProcessing] = useState(false);
  const createPackageRef = useRef<FormikProps<any>>(null);
  const editPackageRef = useRef<FormikProps<any>>(null);
  const createPackageRewardRef = useRef<FormikProps<any>>(null);
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
      let response = await fetch(`/api/private/getPackages/`, {
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
    data: DataRewardPagination,
    isFetching: isFetchingRewardPagination,
    isLoading: isLoadingRewardPagination,
    refetch: RefetchRewardPagination,
  } = useQuery({
    queryKey: ["getReward", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getRewards`, {
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
    data: DataPackageRewardPagination,
    isFetching: isFetchingPackageRewardPagination,
    isLoading: isLoadingPackageRewardPagination,
    refetch: RefetchPackageRewardPagination,
  } = useQuery({
    queryKey: ["getPackageReward", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getPackageReward`, {
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

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelectChange = (event: any) => {
    const newValue = event.target.value;

    console.log(newValue);
    setSelectedValue(newValue);
      // Convert the string to a number using parseInt or the unary plus operator
  const numericValue = parseInt(newValue, 10);
  // const numericValue = +newValue;

  createPackageRewardRef.current?.setFieldValue("reward_id", numericValue);
};



  const createPackageMutation = useMutation({
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
        queryKey: ["getPackagesPagination", page],
      });


      showToast({
        status: "success",
        message: "Package Created Successfully",
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

  const PackageValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    multiplier: yup.number().required("Multiplier is required"),
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const [isAddRewardModalOpen, setAddRewardModalOpen] = useState(false);
  const [rowDataToEdit, setRowDataToEdit] = useState<Element | null>(null);


  const CreatePacakgeRewardhandle = useCallback(
    async (values: any) => {
      setProcessing(true);
      setAddRewardModalOpen(true);
      const headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json',
      };
  
      try {
        console.log("the values are: ",values);
        const response = await fetch(`/api/private/createPackageReward/`, {
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
          message: 'Added Reward Successfully',
        
        });
        RefetchPackageRewardPagination();
        setProcessing(false);
        createPackageRewardRef.current?.resetForm();
        setAddRewardModalOpen(true);
      } catch (error) {
        showToast({
          status: 'error',
          message: 'Something went wrong',
        });
        setProcessing(false);
        setAddRewardModalOpen(false);
        console.error(error);
      }
    },
    [setProcessing, showToast,setAddRewardModalOpen, RefetchPackageRewardPagination, createPackageRewardRef]
  );
  // ... other functions ...
  const initialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    multiplier: rowDataToEdit ? rowDataToEdit.multiplier : "",
    id : rowDataToEdit ? rowDataToEdit.package_id : 0,
    update_at: new Date().toLocaleTimeString(),
    reward_id : rowDataToEdit ? rowDataToEdit.reward_id : 0,

    // ... add other fields as needed ...
  };
  const PackageRewardinitialValues = {
    package_id : rowDataToEdit ? rowDataToEdit.package_id : 0,
    reward_id : rowDataToEdit ? rowDataToEdit.reward_id : 0,
    created_at: new Date().toLocaleTimeString(),

    // ... add other fields as needed ...
  };

  const handlegetProduct_idClick = (rowData: Element) => {
    console.log("Add reward clicked for row:", rowData);
    setRowDataToEdit(rowData);
    setAddRewardModalOpen(false);
  };
  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await CreatePacakgeRewardhandle(values);
    setEditModalOpen(false);  
  };  
  useEffect(() => {
    console.log("Row data updated:", rowDataToEdit);
    if (rowDataToEdit) {
      createPackageRewardRef.current?.setValues({
        package_id: rowDataToEdit.id,
        reward_id: rowDataToEdit.reward_id,
        created_at: rowDataToEdit.created_at,
      });
    }
  }, [rowDataToEdit]);

  return (
    <div className="w-full h-full pl-10">
    {/* add modal */}
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
  <div className="modal-box" style={{ width: 800 }}>

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
              created_at: new Date().toLocaleTimeString(),
            }}
            ref={createPackageRef}
            validationSchema={PackageValidation}
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
              createPackageMutation.mutate(bodyContent);
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

{/* add package_reward */}
<input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={isAddRewardModalOpen}
        onChange={() => setAddRewardModalOpen(!isAddRewardModalOpen)}
      />
<div className="modal" role="dialog">
  <div className="modal-box w-11/12 max-w-5xl">

          <form method="dialog">
            <label
              htmlFor="my_modal_7"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
            >
              ✕
            </label>
          </form>
          <h3 className="font-bold text-lg">Add Reward</h3>
          <Formik
 initialValues={PackageRewardinitialValues}
            innerRef={createPackageRewardRef}
            onSubmit={onSubmit}
          >
            {({ errors, touched,values, setFieldValue }) => (
              <Form>
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Reward Name
                  </span>
                </label>
                 <select
                  name="reward_id"
                  className="select select-bordered w-full max-w-xs font-semibold text-base"
                  id=""
                  onChange={handleSelectChange}
                  value={values.reward_id}
                >
                  <option  value="">
                    Select Reward Name
                  </option>
                  {DataRewardPagination?.data.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                    <Field
                    type="text"
                    placeholder="Enter Package Name"
                    className="input input-bordered invisible"
                    name="package_id"
                  />
                <div className="m-8 ">
                  <div className="">
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
                <div className="overflow-x-auto max-h-96">
  <table className="table table-xs table-pin-rows text-base text-black table-pin-cols">
    <thead>
      <tr>
        <th>Reward_id</th> 
        <td>Package_id</td> 
        <td>Action</td> 
      </tr>
    </thead> 
          <tbody>
            {isFetchingPackageRewardPagination ? (
              <tr className="text-center">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              DataPackageRewardPagination.data.map((element: any) => {
              // console.log(element);
                return (
                  <tr key={element.id}>
                    <td>{element.reward_id}</td>
                    <td>{element.package_id}</td>

                    <td className="flex">
                      <div className="flex mx-auto">

                        <label
                          htmlFor="my_modal_8"
                          className="btn btn-sm btn-info mr-2"
                    
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
                        <button className="btn btn-sm btn-error"
                        >
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
</div>
              </Form>
            )}
          </Formik>
          
        </div>
      </div>

{/* packagereward remove */}


      <div className="overflow-x-auto mt-5 text-black">
        <table className="table  text-base font-semibold text-center">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Multiplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr className="text-center">
                <td colSpan={3}>Loading...</td>
              </tr>
            ) : (
              DataPackagesPagination.data.map((element: any) => {
              // console.log(element);
                return (
                  <tr key={element.package_id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td>{element.multiplier}</td>

                    <td className="flex">
                      <div className="flex mx-auto">

                      <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-accent mr-2"
                        onClick={() => handlegetProduct_idClick(element)}
                        >
                          <Image
                            src="/icons/addrewards.svg"
                            width={20}
                            height={20}
                            alt="reward Icon"
                          />
                          Add Reward
                        </label>

                        <label
                          htmlFor="my_modal_8"
                          className="btn btn-sm btn-info mr-2"
                    
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
                        <button className="btn btn-sm btn-error"
                        >
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

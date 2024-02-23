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
  package_id: number;
  start_date: string;
  end_date: string;
  updated_at: string;
  deleted_at: string;
  is_exist: number;
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
  const removeCampaignRewardRef = useRef<FormikProps<any>>(null);
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
    queryKey: ["getCampaignPagination", page,searchTerm],
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

  const {
    data: DataPackagePagination,
    isFetching: isFetchingPackagePagination,
    isLoading: isLoadingPackagePagination,
    refetch: RefetchPackagePagination,
  } = useQuery({
    queryKey: ["getPackagePagination", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getPackages`, {
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
      let response = await fetch(`/api/private/getActions`, {
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
    queryKey: ["getRewardsPagination", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getRewardsCampaign`, {
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
    data: DataCampaignRewardActionPagination,
    isFetching: isFetchingCampaignRewardActionPagination,
    isLoading: isLoadingCampaignRewardActionPagination,
    refetch: RefetchCampaignRewardActionPagination,
  } = useQuery({
    queryKey: ["getCampaignRewardActionReward", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getCampaignRewardAction`, {
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
        // Reset the select element
    handleSelectChangePackage({ target: { value: "" } });
        RefetchCampaignPagination();
        setProcessing(false);
        createCampaignRef.current?.resetForm();
        setModalOpen(false);
      } else {
        showToast({
          status: "error",
          message: "Something went wrong, fill all fields and try again",
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

   const campaignValidation = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    package_id: yup.number().required('Package is required'),
    start_date: yup.date().required('Start Date is required'),
    end_date: yup.date().required('End Date is required'),
  });
  const campaignRewardActionValidation = yup.object().shape({
    quantity: yup
    .number()
    .required('Quantity is required')
    .test('validate-quantity', 'Quantity cannot be greater than available quantity', function (value) {
      const availableQuantity = selectedRewardData?.quantity; // Get available quantity from selected reward
      return validateQuantity(value || 0, availableQuantity) === undefined;
    }),
    action_id: yup.number().required('Action Name is required'),
    reward_id: yup.number().required('Reward Name is required'),
  });

  
  // ... other functions ...
  const UpdateinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    package_id: rowDataToEdit ? rowDataToEdit.package_id : 0,
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
  values.description === rowDataToEdit?.description &&
  values.package_id === rowDataToEdit?.package_id
) {
  showToast({
    status: 'error',
    message: 'Campaign data is the same, no changes made',
  });

  setProcessing(false);
  return;
}
const isDataExisting = DataCampaignPagination.data.some(
  (element: Element) =>
    element.id !== rowDataToEdit?.id &&
    element.name === values.name &&
    element.description === values.description &&
    element.package_id === values.package_id &&
    element.is_exist === 1
);

if (isDataExisting) {
  showToast({
    status: 'error',
    message: 'Campaign with these updated values already exists',
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
    [setProcessing, showToast,setEditModalOpen, RefetchCampaignPagination, editCampaignRef, rowDataToEdit]
  );

  const onSubmit = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleUpdateCampaign(values);
    setEditModalOpen(false);  
  };  


  const RemoveinitialValues = {
    name: rowDataToEdit ? rowDataToEdit.name : "",
    description: rowDataToEdit ? rowDataToEdit.description : "",
    package_id: rowDataToEdit ? rowDataToEdit.package_id : 0,
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
  const handleRemoveCampaign = useCallback(
    async (values: any) => {
      setProcessing(true);
      setRemoveModalOpen(false);
      const headersList = {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        'Content-Type': 'application/json',
      };
  
      try {
        console.log("the values are: ", values);
  
        // Check if DataCampaignRewardActionPagination is defined and has a 'data' property
        if (!DataCampaignRewardActionPagination || !DataCampaignRewardActionPagination.data) {
          showToast({
            status: 'error',
            message: 'Campaign data is not available.',
          });
  
          setProcessing(false);
          return;
        }
  
        const isActionUsedInCampaign = DataCampaignRewardActionPagination.data.some(
          (campaign: any) => campaign.campaign_id === values.id && campaign.is_exist === 1
        );
  
        if (isActionUsedInCampaign) {
          showToast({
            status: 'error',
            message: 'This campaign is currently used and cannot be removed.',
          });
  
          setProcessing(false);
          return;
        }
  
        console.log("the values are: ", values);
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
    [setProcessing, showToast, setRemoveModalOpen, RefetchCampaignPagination, editCampaignRef, DataCampaignRewardActionPagination]
  );
  
  const onSubmitRemove = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleRemoveCampaign(values);
    setModalOpen(false);  
  };  

  const [selectedValueAction, setSelectedValueAction] = useState("");
  const [selectedValueReward, setSelectedValueReward] = useState("");
  const [selectedRewardData, setSelectedRewardData] = useState<RewardActionElement | null>(null);
  const RewardActioninitialValues = {
    action_id: selectedValueAction || (rowDataToEditPR ? rowDataToEditPR.action_id : 0),
    reward_id: selectedValueReward || (rowDataToEditPR ? rowDataToEditPR.reward_id : 0),
    campaign_id: rowDataToEditPR ? rowDataToEditPR.id : 0, // Use the correct value here
    quantity: rowDataToEditPR ? rowDataToEditPR.quantity : 0,
  };
  
  const [selectedValuePacakage, setSelectedValuePackage] = useState("");
  const handleSelectChangePackage = (event: any) => {
    const newValueAction = event.target.value;
    console.log(newValueAction);
    setSelectedValuePackage(newValueAction);
  
    // Convert the string to a number using parseInt or the unary plus operator
    const numericValueAction = parseInt(newValueAction, 10);
    createCampaignRef.current?.setFieldValue("package_id", numericValueAction);
  };
  const handleSelectChangeAction = (event: any) => {
    const newValueAction = event.target.value;
    console.log(newValueAction);
    setSelectedValueAction(newValueAction);
  
    // Convert the string to a number using parseInt or the unary plus operator
    const numericValueAction = parseInt(newValueAction, 10);
    createCampaignRewardRef.current?.setFieldValue("action_id", numericValueAction);
  };
  
  const handleSelectChangeReward = (event: any) => {
    const newValueReward = event.target.value;
    console.log(newValueReward);
    setSelectedValueReward(newValueReward);
  
    const selectedReward = DataRewardPagination?.data.find((item: any) => item.id === parseInt(newValueReward, 10));
    setSelectedRewardData(selectedReward);
  
    // Console.log the quantity of the selected reward
    console.log("Quantity:", selectedReward?.quantity);
  
    // Convert the string to a number using parseInt or the unary plus operator
    const numericValueReward = parseInt(newValueReward, 10);
    createCampaignRewardRef.current?.setFieldValue("reward_id", numericValueReward);
  };


  const CreateCampaignRewardActionhandle = useCallback(
    async (values: any) => {
      setProcessing(true);
      setAddRewardActionModalOpen(true);
  
      try {
        // Check if the name and description remain the same
        if (
          values.action_id === values.action_id &&
          values.reward_id === values.reward_id &&
          values.is_exist === 1
        ) {
          showToast({
            status: 'error',
            message: 'Reward and Action are already existing. Cannot Add Reward and Action',
          });
  
          setProcessing(false);
          return;
        }
  
        const createResponse = await fetch(`/api/private/createCampaignRewardAction/`, {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            Accept: "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          },
        });
  
        if (!createResponse.ok) {
          throw new Error(`HTTP error! Status: ${createResponse.status}`);
        }
  
        showToast({
          status: "success",
          message: "Added Reward And Action Successfully",
        });
  
        // Refetch data after creating
        RefetchActionPagination();
        RefetchRewardPagination();
  
        // Clear form fields
        createCampaignRewardRef.current?.setFieldValue('action_id', '');
        createCampaignRewardRef.current?.setFieldValue('reward_id', '');
        createCampaignRewardRef.current?.setFieldValue('quantity', 0);
  
        // Refetch Campaign Reward Action data
        RefetchCampaignRewardActionPagination();
  
        // Set modal to open
        setAddRewardActionModalOpen(false);
  
        // Get the selectedRewardData after creating
        const selectedReward = DataRewardPagination?.data.find(
          (item: any) => item.id === parseInt(values.reward_id, 10)
        );
  
        // Update the reward quantity using the selectedRewardData
        if (selectedReward) {
          const updateResponse = await fetch(`/api/private/editRewardQuantity/`, {
            method: "POST",
            body: JSON.stringify({
              id: values.reward_id,
              quantity: selectedReward.quantity - values.quantity,
            }),
            headers: {
              Accept: "*/*",
              "User-Agent": "Thunder Client (https://www.thunderclient.com)",
              "Content-Type": "application/json",
            },
          });
  
          if (!updateResponse.ok) {
            throw new Error(`HTTP error! Status: ${updateResponse.status}`);
          }
          RefetchActionPagination();
          RefetchRewardPagination();
    
          // Clear form fields
          createCampaignRewardRef.current?.setFieldValue('action_id', '');
          createCampaignRewardRef.current?.setFieldValue('reward_id', '');
          createCampaignRewardRef.current?.setFieldValue('quantity', 0);
          selectedRewardData?.quantity ==0;
    
          // Refetch Campaign Reward Action data
          RefetchCampaignRewardActionPagination();
          // Set modal to open
          setAddRewardActionModalOpen(true);
        }
      } catch (error) {
        showToast({
          status: "error",
          message: "Something went wrong",
        });
        console.error(error);
      } finally {
        setProcessing(false);
        setAddRewardActionModalOpen(true);
      }
    },
    [
      setProcessing,
      showToast,
      setAddRewardActionModalOpen,
      RefetchRewardPagination,
      createCampaignRewardRef,
      DataRewardPagination,
      RefetchActionPagination,
      RefetchCampaignRewardActionPagination,
    ]
  );
  
  
  const [campaigIdToAddReward, setCampiagnIdToAddReward] = useState(0);
  const handlegetProduct_idClick = (rowData: RewardActionElement) => {
    console.log("Add reward clicked for row:", rowData);
    setRowDataToEditPR(rowData);
    setCampiagnIdToAddReward(rowData.id);
    setAddRewardActionModalOpen(false);
  };
  const onSubmitRewardAction = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
  
    // Check for existing data
    const isDataExisting = DataCampaignRewardActionPagination.data.some(
      (element: RewardActionElement) =>
        element.reward_id === values.reward_id &&
        element.action_id === values.action_id &&
        element.campaign_id === values.campaign_id &&
        element.is_exist === 1
    );
  
    if (isDataExisting) {
      showToast({
        status: "error",
        message: "Reward with this Reward and Action already exists",
      });
  
      setEditModalOpen(false);
      return;
    }
  
    try {
      // Update the quantity in DataRewardPagination
      const updatedDataRewardPagination = DataRewardPagination?.data.map((item: any) => {
        if (item.id === values.reward_id) {
          return { ...item, quantity: selectedRewardData?.quantity };
        }
        return item;
      });
  
      // Set the updated DataRewardPagination
      if (DataRewardPagination) {
        DataRewardPagination.data = updatedDataRewardPagination;
      }
  
      // Call the CreateCampaignRewardActionhandle function
      await CreateCampaignRewardActionhandle(values);
  
      // Close the edit modal
      setEditModalOpen(false);
    } catch (error) {
      showToast({
        status: "error",
        message: "Something went wrong",
      });
      console.error(error);
    }
  };
  
  useEffect(() => {
    console.log("Row data updated:", rowDataToEdit);
    if (rowDataToEditPR) {
      createCampaignRewardRef.current?.setValues({
        action_id: rowDataToEditPR.action_id,
        reward_id: rowDataToEditPR.reward_id,
        quantity: rowDataToEditPR.quantity,
        campaign_id: campaigIdToAddReward,
      
      });
    }
  }, [rowDataToEditPR, campaigIdToAddReward]);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Add one day to exclude yesterday
  const formattedCurrentDate = currentDate.toISOString().split('T')[0];
  const validateQuantity = (value: number, availableQuantity: number | undefined) => {
    if (typeof availableQuantity === 'number' && value > availableQuantity) {
      return 'Quantity cannot be greater than available quantity';
    }
    return undefined; // No validation error
  };


  const RemoveCampaignRewardinitialValues = {
    id: rowDataToEditPR ? rowDataToEditPR.id : 0,
    action_id: rowDataToEditPR ? rowDataToEditPR.action_id : 0,
    reward_id: rowDataToEditPR ? rowDataToEditPR.reward_id : 0,
    removed_at: new Date(),
    is_exist: rowDataToEditPR ? rowDataToEditPR.is_exist : 0,
  };
  const handleRemoveClickCampaignReward = (rowData: RewardActionElement) => {
    console.log("Edit clicked for row:", rowData);
    setRowDataToEditPR(rowData);
    setRemoveModalOpenRewardAction(false);
  };
  const handleRemoveCampaignRewardAction = useCallback(
    async (values: any) => {
      setProcessing(true);
      setRemoveModalOpenRewardAction(false);
      
      const headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      try {
        console.log("the values are: ", values);
        const response = await fetch(`/api/private/removeCampaignRewardAction/`, {
          method: "POST",
          body: JSON.stringify(values),
          headers: headersList,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        showToast({
          status: "success",
          message: "Campaign Reward Deleted Successfully",
        });
        RefetchCampaignRewardActionPagination();
        setProcessing(false);
        createCampaignRewardRef.current?.setFieldValue('action_id', '');
        createCampaignRewardRef.current?.setFieldValue('reward_id', '');
        createCampaignRewardRef.current?.setFieldValue('quantity', 0);
  
        setRemoveModalOpenRewardAction(false);
      } catch (error) {
        showToast({
          status: "error",
          message: "Something went wrong",
        });
        setProcessing(false);
        setRemoveModalOpenRewardAction(false);
        console.error(error);
      }
    },
    [
      setProcessing,
      showToast,
      setRemoveModalOpenRewardAction,
      RefetchCampaignRewardActionPagination,
      createCampaignRewardRef,
    ]
  );

  const onSubmitRemoveCampaignReward = async (values: any) => {
    console.log("Edit Form submitted with values:", values);
    await handleRemoveCampaignRewardAction(values);
    setRemoveModalOpenRewardAction(false);
  };
  return (
    <div className="w-full h-full px-2">
      {/* add modal */}
      <div className="flex w-full">
  {/* add modal */}
  <label htmlFor="my_modal_6" className="btn btn-primary">
    Add Campaign
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
              package_id: selectedValuePacakage || (rowDataToEdit ? rowDataToEdit.package_id : 0),
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
              
              const isDataExisting = DataCampaignPagination.data.some(
                (element: Element) =>
                  element.name === values.name && element.description === values.description && element.package_id === values.package_id && element.is_exist === 1
              );
            
              if (isDataExisting) {
                showToast({
                  status: "error",
                  message: "Camapign with this data is already exists",
                });
            
                setProcessing(false);
                return;
              }
              resetForm();
              values.start_date = values.start_date;
              values.end_date = values.end_date;
              let bodyContent = JSON.stringify({
                name: values.name,
                description: values.description,
                package_id: selectedValuePacakage,
                start_date: values.start_date,
                end_date: values.end_date,
                created_at: values.created_at,
                is_exist: values.is_exist,
              });
              createCampaignMutation.mutate(bodyContent);
            }}
          >
            {({ errors, touched , values }) => (
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
                  <label className="label">
                  <span className="label-text text-base font-semibold">
                    Package Name
                  </span>
                </label>
                <select
  name="package_id"
  className="select select-bordered w-full max-w-xs font-semibold text-base"
  id=""
  onChange={handleSelectChangePackage}
  value={selectedValuePacakage}
>
  <option value="">Select Package Name</option>
  {DataPackagePagination?.data.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
<ErrorMessage name="package_id" className="flex">
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
                      onClick={() => {handleSelectChangePackage({ target: { value: "" } }); }}
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
             innderRef={editCampaignRef}
             validationSchema={campaignValidation}
             onSubmit={onSubmit}
          >
            {({ errors, touched, values, setFieldValue }) => (
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
                  <select
  name="package_id"
  className="select select-bordered w-full max-w-xs font-semibold text-base"
  id=""
  onChange={(event) => {
    const selectedValue = event.target.value;
    console.log("the value is: ",selectedValue);
    const selectedValueAsInt = parseInt(selectedValue, 10);
    setFieldValue('package_id', selectedValueAsInt);
  }}
  value={values.package_id} // Fix the variable name here
>
  <option value="">Select Package Name</option>
  {DataPackagePagination?.data.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
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
                  placeholder="Enter Campaign Name"
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
                  placeholder="Enter Campaign Name"
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

{/* Add Reward & Action */}
<input type="checkbox" id="my_modal_10"
 checked={isAddRewardActionModalOpen}
        onChange={() => setAddRewardActionModalOpen(!isAddRewardActionModalOpen)}
        className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
          <label
              htmlFor="my_modal_10"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
            >
              ✕
            </label>
          </form>
          <h3 className="font-bold text-lg">Add Reward and Action</h3>
          <Formik
            validationSchema={campaignRewardActionValidation}
            initialValues={RewardActioninitialValues}
            onSubmit={onSubmitRewardAction}
            innerRef={createCampaignRewardRef}
            
          >
            {({errors, touched, values,setFieldValue}) => (
            <Form>
              <div className="form-control bg-white">
              <label className="label">
                  <span className="label-text text-base font-semibold">
                    Action Name
                  </span>
                </label>
                <select
  name="action_id"
  className="select select-bordered w-full max-w-xs font-semibold text-base"
  id=""
  onChange={handleSelectChangeAction}
  value={values.action_id}
>
  <option value="">Select Action Name</option>
  {DataActionPagination?.data.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
              <label className="label">
                  <span className="label-text text-base font-semibold">
                    Reward Name
                  </span>
                </label>
                <select
  name="reward_id"
  className="select select-bordered w-full max-w-xs font-semibold text-base"
  id=""
  onChange={handleSelectChangeReward}
  value={values.reward_id}
>
  <option value="">Select Reward Name</option>
  {DataRewardPagination?.data.map((item: any) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
<span className="label-text text-base font-semibold"> Available Quantity:  {selectedRewardData?.quantity}</span>
                <label className="label">
                  <span className="label-text text-base font-semibold">
                    Quantity
                  </span>
                </label>
                <Field
                  type="number"
                  placeholder="Enter Quantity"
                  className="input input-bordered"
                  name="quantity"
                />
                      <ErrorMessage name="quantity" className="flex">
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
                  <Field
                  type="text"
                  placeholder="Enter Campiagn ID"
                  className="input input-bordered invisible"
                  name="campaign_id"
                />
</div>
            <div className="m-8 ">
                <div className="">
                <label
                      htmlFor="my_modal_10"
                      className="btn btn-neutral mr-2"
                    >
                      Cancel
                    </label>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>  
            
               <div className="overflow-x-auto w-full h-full mt-5 text-black">
                  <table className="table table-zebra text-base font-semibold text-center table-sm lg:table-lg">
                    <thead>
                      <tr>
                        <th>Reward ID</th>
                        <td>Action ID</td>
                        <td>Quantity</td>
                        <td>Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {isFetchingCampaignRewardActionPagination ? (
                        <tr className="text-center">
                          <td colSpan={3}>Loading...</td>
                        </tr>
                      ) : (
                        DataCampaignRewardActionPagination.data.map((element: any) => {
                          if (element.campaign_id !== values.campaign_id) {
                            return null; // Skip rendering for rows with different package_id
                          }
                          const rewardId = DataRewardPagination?.data.find((item: any) => item.id === parseInt(element.reward_id));
                          const rewardName = rewardId ? rewardId.name : "Unknown"; // Use a default value if not found

                          const ActionID = DataActionPagination?.data.find((item: any) => item.id === parseInt(element.action_id));
                          const actionName = ActionID ? ActionID.name : "Unknown"; // Use a default value if not found
                          return (
                            <tr key={element.id}>
                              <td>{rewardName}</td>
                              <td>{actionName}</td>
                              <td>{element.quantity}</td>
                              <td className="inline place-content-center lg:flex">
                                  <label
                                    className="btn btn-sm btn-error"
                                    htmlFor="my_modal_11"
                                    onClick={() =>
                                      handleRemoveClickCampaignReward(element)
                                    }
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
                </div>
            </Form>
            )}
          </Formik>
        </div>
      </div>


  {/* removePackageReward */}
  <input
        type="checkbox"
        id="my_modal_11"
        className="modal-toggle"
        checked={isRemoveModalOpenRewardAction}
        onChange={() =>
          setRemoveModalOpenRewardAction(!isRemoveModalOpenRewardAction)
        }
      />
      <div className="modal" role="dialog">
        <div className="modal-box" style={{ width: 400 }}>
          <Formik
            initialValues={RemoveCampaignRewardinitialValues}
            enableReinitialize={true}
            onSubmit={onSubmitRemoveCampaignReward}
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
                      Reward ID:
                    </span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Enter Action Name"
                    className="input border-none"
                    name="reward_id"
                    readOnly
                  />
                </div>
                <div className="flex mb-5">
                  <label className="label">
                    <span className="label-text text-base font-semibold">
                      Action ID:
                    </span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Enter Action Name"
                    className="input border-none text-black"
                    name="action_id"
                    readOnly
                  />
                </div>
              </div>
              <div className="m-8 " style={{ marginTop: 60 }}>
                <div className="absolute bottom-6 right-6">
                  <label htmlFor="my_modal_11" className="btn btn-neutral mr-2">
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

      {/* table */}
      <div className="overflow-x-auto w-full h-full mt-5 text-black">
        <table className="table text-base font-semibold text-center">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Package</th>
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
                const isExpired = element.status === 'expired';
                const packageId = DataPackagePagination?.data.find((item: any) => item.id === parseInt(element.package_id));
                const packageName = packageId ? packageId.name : "Unknown"; // Use a default value if not found
                return (
                  <tr key={element.id}>
                    <td>{element.name}</td>
                    <td>{element.description}</td>
                    <td className="badge badge-info">{element.status}</td>
                    <td>{packageName}</td>
                    <td>{new Date(element.start_date).toLocaleDateString()}</td>
                    <td>{new Date(element.end_date).toLocaleDateString()}</td>

                    <td className="flex ">
                    {!isExpired && (
          <>
                        <label className="btn btn-sm btn-accent mr-2"
                        htmlFor="my_modal_10"
                        onClick={() => handlegetProduct_idClick(element)}>
                          <Image
                            src="/icons/addrewards.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                            className="hide-icon"
                          />
                          Add Reward
                        </label>
                        <label htmlFor="my_modal_7" className="btn btn-sm btn-info mr-2"
                        onClick={() => handleEditClick(element)}>
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
                        onClick={() => handleRemoveClick(element)}>
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                            className="hide-icon"
                          />
                          Delete
                        </label>
                 </>
        )}
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

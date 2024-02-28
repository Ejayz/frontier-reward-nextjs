"use client";

import Loading from "@/app/(index)/loading";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputPhone from "@/components/LabeledInputPhone";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import { useToast } from "@/hooks/useToast";
import {
  QueryClient,
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { Form, Formik, FormikProps } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import "yup-phone-lite";
import Image from "next/image";
import updateCustomerCar from "@/pages/api/private/updateCustomerCar";
type vehicleType = {
  table_uuid: string;
  year: string;
  model: string;
  trim: string;
  color: string;
  vin_no: string;
};
export default function Page() {
  const params = useSearchParams();
  const nav = useRouter();
  const [page, setPage] = useState<number>(0);
  const [vehiclelist, setVehicleList] = useState<vehicleType[]>([]);
  const { showToast } = useToast();
  const [formState, setFormState] = useState<string>("add");
  const [toShow, setToShow] = useState<boolean>(true);
  useEffect(() => {
    if (params?.get("user_id") == undefined) {
      toast.error("User ID is required");
      nav.push("/superadmin/users");
    }
  }, [params?.get("user_id")]);
  const editVehicleDetail = useRef<FormikProps<any>>(null);
  const addVehicleDetail = useRef<FormikProps<any>>(null);

  const vehicleSchema = yup.object().shape({
    year: yup
      .number()
      .min(1981, "Year must be 1981 or later")
      .max(new Date().getFullYear(), "Year cannot be in the future")
      .required("Year is required"),
    model: yup.string().required("Model is required"),
    trim: yup.string(),
    color: yup.string().required("Color is required"),
    vin_no: yup
      .string()
      .matches(/^[A-HJ-NPR-Z0-9]{17}$/i, "Please enter a valid VIN number")
      .required("VIN number is required"),
  });

  const notificationContainer = useRef<HTMLDivElement>(null);

  const [dataToRemove, setDataToRemove] = useState<{
    id: string;
    table_uuid: string;
    isFromDb?: boolean;
  }>();

  const confirmModal = useRef<HTMLDialogElement>(null);
  const {
    data: CustomerCarInfo,
    isLoading: isLoadingCustomerCarInfo,
    isFetching: isFetchingCustomerCarInfo,
    refetch: refetchCustomerCarInfo,
  } = useQuery({
    queryKey: ["CustomerCarInfo", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(
        `/api/private/getCustomerCar/?user_id=${params?.get(
          "user_id"
        )}&page=${page}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log(data);
      if (data.code == 401) {
        toast.error(data.message);
        nav.push("/?error=401");
      }
      return data;
    },
    placeholderData: keepPreviousData,
  });
  console.log(CustomerCarInfo);
  const createCarMutation = useMutation({
    mutationFn: async (values: object) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch(`/api/private/createNewCar`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });

      let data = await response.json();
      if (!response.ok) {
        setToShow(true);
        toast.error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.code == 200) {
        refetchCustomerCarInfo();
        showToast({ status: "success", message: data.message });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const editCarMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch(`/api/private/updateCustomerCar`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });

      let data = await response.json();
      if (!response.ok) {
        setToShow(true);
        toast.error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.code == 200) {
        refetchCustomerCarInfo();
        editVehicleDetail.current?.resetForm();
        setFormState("add");
        setPage(0);
        showToast({ status: "success", message: data.message });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeCarMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch(`/api/private/removeCustomerCar`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });

      let data = await response.json();
      if (!response.ok) {
        setToShow(true);
        toast.error(data.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.code == 200) {
        refetchCustomerCarInfo();
        showToast({ status: "success", message: data.message });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const putDataToEditForm = async (data: any) => {
    editVehicleDetail.current?.setValues(data);
  };

  if (!toShow) {
    return <Loading />;
  } else {
    return (
      <div className="w-full h-full flex flex-col overflow-y-scroll">
        <div className="divider uppercase">Vehicle Information</div>
        {formState == "edit" ? (
          <Formik
            innerRef={editVehicleDetail}
            initialValues={{
              car_id: "",
              year: "",
              model: "",
              trim: "",
              color: "",
              vin_no: "",
            }}
            validationSchema={vehicleSchema}
            onSubmit={async (values: any) => {
              const update = await editCarMutation.mutate(values);
              console.log(update);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="grid grid-cols-3 gap-x-2">
                  <LabeledInput
                    field_name="vin_no"
                    type="text"
                    placeholder="Enter Vehicle VIN No"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.vin_no}
                    touched={touched.vin_no}
                    classes="text-base"
                    label="Vehicle ID No. (VIN)"
                    datatip="Vehicle Identification Number"
                  />

                  <LabeledInput
                    field_name="year"
                    type="number"
                    placeholder="Enter Vehicle Year"
                    className="input input-bordered appearance-none input-sm w-full max-w-xs"
                    errors={errors.year}
                    touched={touched.year}
                    classes="text-base"
                    label="Vehicle Year"
                    datatip="Year of the vehicle production"
                  />
                  <LabeledInput
                    field_name="model"
                    type="text"
                    placeholder="Enter Vehicle Model"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.model}
                    touched={touched.model}
                    classes="text-base"
                    label="Vehicle Model"
                    datatip="Model of the vehicle"
                  />
                  <LabeledInput
                    field_name="trim"
                    type="text"
                    placeholder="Enter Vehicle Trim"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.trim}
                    touched={touched.trim}
                    classes="text-base"
                    label="Vehicle Trim"
                    datatip="Trim of the vehicle"
                  />
                  <LabeledInput
                    field_name="color"
                    type="text"
                    placeholder="Enter Vehicle Color"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.color}
                    touched={touched.color}
                    classes="text-base"
                    label="Vehicle Color"
                    datatip="Color of the vehicle"
                  />
                </div>
                <div id="notif" ref={notificationContainer}></div>
                <button className="btn btn-primary mt-4">Edit Vehicle</button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            innerRef={addVehicleDetail}
            initialValues={{
              year: "",
              model: "",
              trim: "",
              color: "",
              vin_no: "",
            }}
            validationSchema={vehicleSchema}
            onSubmit={async (values: any) => {
              createCarMutation.mutate({
                user_id: params?.get("user_id"),
                year: values.year,
                model: values.model,
                trim: values.trim,
                color: values.color,
                vin_no: values.vin_no,
              });
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="grid grid-cols-3 gap-x-2">
                  <LabeledInput
                    field_name="vin_no"
                    type="text"
                    placeholder="Enter Vehicle VIN No"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.vin_no}
                    touched={touched.vin_no}
                    classes="text-base"
                    label="Vehicle VIN No"
                  />

                  <LabeledInput
                    field_name="year"
                    type="number"
                    placeholder="Enter Vehicle Year"
                    className="input input-bordered appearance-none input-sm w-full max-w-xs"
                    errors={errors.year}
                    touched={touched.year}
                    classes="text-base"
                    label="Vehicle Year"
                  />
                  <LabeledInput
                    field_name="model"
                    type="text"
                    placeholder="Enter Vehicle Model"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.model}
                    touched={touched.model}
                    classes="text-base"
                    label="Vehicle Model"
                  />
                  <LabeledInput
                    field_name="trim"
                    type="text"
                    placeholder="Enter Vehicle Trim"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.trim}
                    touched={touched.trim}
                    classes="text-base"
                    label="Vehicle Trim"
                  />
                  <LabeledInput
                    field_name="color"
                    type="text"
                    placeholder="Enter Vehicle Color"
                    className="input input-bordered input-sm w-full max-w-xs"
                    errors={errors.color}
                    touched={touched.color}
                    classes="text-base"
                    label="Vehicle Color"
                  />
                </div>
                <div id="notif" ref={notificationContainer}></div>
                <button className="btn btn-primary mt-4">Add Vehicle</button>
              </Form>
            )}
          </Formik>
        )}
        <table className="table mt-4">
          <thead>
            <tr>
              <th>VIN No</th>
              <th>Year</th>
              <th>Model</th>
              <th>Trim</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingCustomerCarInfo || isFetchingCustomerCarInfo ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <span className="loading loading-dots loading-md"></span>
                </td>
              </tr>
            ) : !CustomerCarInfo.data ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No more vehicle found.
                </td>
              </tr>
            ) : (
              CustomerCarInfo.data.map((vehicle: any) => (
                <tr key={vehicle.table_uuid}>
                  <td>{vehicle.vin_no}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.trim}</td>
                  <td>{vehicle.color}</td>
                  <td className="flex flex-row">
                    <button
                      type="button"
                      className="btn flex flex-row btn-info mx-2"
                      onClick={async () => {
                        await setFormState("edit");
                        await putDataToEditForm({
                          car_id: vehicle.table_uuid,
                          year: vehicle.year,
                          model: vehicle.model,
                          trim: vehicle.trim,
                          color: vehicle.color,
                          vin_no: vehicle.vin_no,
                        });
                      }}
                    >
                      <Image
                        src={"/icons/editicon.svg"}
                        alt={"Edit"}
                        width={20}
                        height={20}
                      />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn  btn-error"
                      onClick={async () => {
                        const mutation = removeCarMutation.mutate({
                          car_id: vehicle.table_uuid,
                        });
                        console.log(mutation);
                      }}
                    >
                      <Image
                        src={"/icons/deleteicon.svg"}
                        alt={"DELETE"}
                        width={20}
                        height={20}
                      />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="join mx-auto">
          <button
            className="join-item btn"
            onClick={() => {
              if (page !== 0) {
                const newPage = page - 1;
                setPage(newPage);
              }
            }}
          >
            «
          </button>
          <button className="join-item btn">Page {page + 1}</button>
          <button
            className="join-item btn"
            onClick={() => {
              if (CustomerCarInfo.data.length == 5) {
                const newPage = page + 1;
                setPage(newPage);
              } else {
                return;
              }
            }}
          >
            »
          </button>
        </div>
      </div>
    );
  }
}

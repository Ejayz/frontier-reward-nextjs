"use client";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputPhone from "@/components/LabeledInputPhone";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import { useQuery } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import Link from "next/link";
import React, { useState, useRef, useEffect, createElement } from "react";
import { PhoneInput } from "react-international-phone";
import { toast } from "react-toastify";
import * as yup from "yup";
import "yup-phone-lite";
type vehicleType = {
  table_uuid: string;
  vehicle_id: string;
  year: string;
  model: string;
  trim: string;
  color: string;
  vin_no: string;
};
type phoneType = {
  areaCodes: number[] | undefined;
  dialCode: string;
  format: string;
  iso2: string;
  name: string;
  priority: number;
};
export default function Page() {
  const [userType, setUserType] = useState("");
  const modalForm = useRef<HTMLDialogElement>(null);
  const handleUserTypeChange = (event: any) => {
    setUserType(event.target.value);
  };
  const confirmBox = useRef<HTMLInputElement>(null);
  const CustomerAccountDetail = useRef<FormikProps<any>>(null);
  const VehicleDetail = useRef<FormikProps<any>>(null);
  const notificationContainer = useRef<HTMLDivElement>(null);
  const [phoneInfo, setPhoneInfo] = useState<phoneType>({
    areaCodes: [
      204, 226, 236, 249, 250, 289, 306, 343, 365, 387, 403, 416, 418, 431, 437,
      438, 450, 506, 514, 519, 548, 579, 581, 587, 604, 613, 639, 647, 672, 705,
      709, 742, 778, 780, 782, 807, 819, 825, 867, 873, 902, 905,
    ],
    dialCode: "1",
    format: "(...) ...-....",
    iso2: "ca",
    name: "Canada",
    priority: 1,
  });
  useEffect(() => {
    async function init() {
      await new Promise((r) => setTimeout(r, 6000));
    }
    init();
  }, []);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["getPackages"],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/getPackages", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
      return data;
    },
  });
  const [vehiclelist, setVehicleList] = useState<vehicleType[]>([]);
  const customerValidation = yup.object({
    first_name: yup.string().required("First Name is required."),
    last_name: yup.string().required("Last Name is required."),
    email: yup.string().email().required("Email is required."),
    phone_number: yup
      .string()
      .phone(
        phoneInfo?.iso2.toUpperCase(),
        `Enter a valid phone number for ${phoneInfo?.name}`
      )
      .required("Phone Number is required."),
    points: yup.number().min(0).required("Starting points is required"),
    package: yup.string().required("Package is required"),
  });
  const vehicleSchema = yup.object().shape({
    vehicle_id: yup.string().required("Vehicle ID is required"),
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

  const [dataToRemove, setDataToRemove] = useState<{
    id: string;
    table_uuid: string;
  }>();
  const confirmModal = useRef<HTMLDialogElement>(null);
  const modalAddUser = useRef<HTMLInputElement>(null);
  return (
    <div className="pl-10 z-10">
      <dialog
        id="my_modal_1"
        ref={confirmModal}
        onClose={() => {
          setDataToRemove(undefined);
        }}
        className="modal"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Action</h3>
          <p className="py-4">
            Are you sure you want to remove {dataToRemove?.id} ?
          </p>
          <div className="modal-action">
            <button
              onClick={() => {
                setVehicleList((oldList) =>
                  oldList.filter(
                    (item) => item.table_uuid !== dataToRemove?.table_uuid
                  )
                );
                setDataToRemove(undefined);
                confirmModal.current?.close();
              }}
              className="btn btn-error"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setDataToRemove(undefined);
                confirmModal.current?.close();
              }}
              className="btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* The button to open modal */}
      <label htmlFor="add_user" className="btn btn-accent">
        Add User
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="add_user"
        onChange={() => {
          setUserType("");
          CustomerAccountDetail.current?.resetForm();
          VehicleDetail.current?.resetForm();
          setVehicleList([]);
        }}
        ref={modalAddUser}
        className="modal-toggle"
      />
      <div id="add_user_modal" className="modal" role="dialog">
        <div className="modal-box w-11/12 h-11/12 max-w-7xl z-50">
          <label
            htmlFor="add_user"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>

          <h3 className="font-bold text-lg">Add User</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered  select-sm w-full max-w-xs"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <option value="">Select an option</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
            {userType === "Customer" && (
              <>
                <div className="divider uppercase">Customer Information</div>
                <Formik
                  innerRef={CustomerAccountDetail}
                  initialValues={{
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    points: "",
                    package: "",
                  }}
                  validationSchema={customerValidation}
                  onSubmit={(values: any) => {}}
                >
                  {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                      <div className="customer grid grid-cols-3 gap-x-2">
                        <LabeledInput
                          field_name="first_name"
                          type="text"
                          placeholder="Enter First Name"
                          className="input input-bordered   input-sm w-full max-w-xs"
                          errors={errors.first_name}
                          touched={touched.first_name}
                          classes="text-base"
                          label="First Name"
                        />
                        <LabeledInput
                          field_name="last_name"
                          type="text"
                          placeholder="Enter Last Name"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.last_name}
                          touched={touched.last_name}
                          classes="text-base"
                          label="Last Name"
                        />
                        <LabeledInput
                          field_name="email"
                          type="email"
                          placeholder="Enter Email"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.email}
                          touched={touched.email}
                          classes="text-base"
                          label="Email"
                        />

                        <LabeledInputPhone
                          field_name="phone_number"
                          placeholder="Enter Phone Number"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.phone_number}
                          touched={touched.phone_number}
                          classes="text-base"
                          label="Phone Number"
                          value={values.phone_number}
                          setFieldValue={setFieldValue}
                          setPhoneInfo={setPhoneInfo}
                          costumerValidation={customerValidation}
                        />
                        <LabeledInput
                          field_name="points"
                          type="number"
                          placeholder="Enter Points"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.points}
                          touched={touched.points}
                          classes="text-base"
                          label="Points"
                        />
                        <LabeledSelectInput
                          field_name="package"
                          type="text"
                          placeholder="Enter Package"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.package}
                          touched={touched.package}
                          classes="text-base"
                          label="Package"
                          SelectOptions={
                            isFetching || isLoading ? [] : data.data
                          }
                          setFieldValue={setFieldValue}
                          values={values.package}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="divider uppercase">Vehicle Information</div>
                <Formik
                  innerRef={VehicleDetail}
                  initialValues={{
                    vehicle_id: "",
                    year: "",
                    model: "",
                    trim: "",
                    color: "",
                    vin_no: "",
                  }}
                  validationSchema={vehicleSchema}
                  onSubmit={async (values: any) => {
                    if (
                      vehiclelist.find(
                        (item) => item.vehicle_id === values.vehicle_id
                      )
                    ) {
                      toast.error("Vehicle ID already exists in the list");
                    } else {
                      const formatted_values = {
                        table_uuid: Math.random().toString(36).substring(7),
                        vehicle_id: values.vehicle_id,
                        year: values.year,
                        model: values.model,
                        trim: values.trim,
                        color: values.color,
                        vin_no: values.vin_no,
                      };
                      setVehicleList((oldList) => [
                        ...oldList,
                        formatted_values,
                      ]);
                    }
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="grid grid-cols-3 gap-x-2">
                        <LabeledInput
                          field_name="vehicle_id"
                          type="text"
                          placeholder="Enter Vehicle ID"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.vehicle_id}
                          touched={touched.vehicle_id}
                          classes="text-base"
                          label="Vehicle ID"
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
                      </div>
                      <div id="notif" ref={notificationContainer}></div>
                      <button className="btn btn-primary mt-4">
                        Add Vehicle
                      </button>

                      <table className="table mt-4">
                        <thead>
                          <tr>
                            <th>Vehicle ID</th>
                            <th>Year</th>
                            <th>Model</th>
                            <th>Trim</th>
                            <th>Color</th>
                            <th>VIN No</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehiclelist.map((vehicle) => (
                            <tr key={vehicle.table_uuid}>
                              <td>{vehicle.vehicle_id}</td>
                              <td>{vehicle.year}</td>
                              <td>{vehicle.model}</td>
                              <td>{vehicle.trim}</td>
                              <td>{vehicle.color}</td>
                              <td>{vehicle.vin_no}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-error"
                                  onClick={() => {
                                    setDataToRemove({
                                      id: vehicle.vehicle_id,
                                      table_uuid: vehicle.table_uuid,
                                    });
                                    confirmModal.current?.showModal();
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Form>
                  )}
                </Formik>
                <div className="modal-action">
                  <button
                    onClick={() => {
                      console.log(
                        CustomerAccountDetail.current?.isValid,
                        vehiclelist.length
                      );
                    }}
                    className="btn btn-info btn-md"
                  >
                    Create User
                  </button>{" "}
                  <button
                    onClick={() => {
                      modalAddUser.current?.click();
                    }}
                    className="btn btn-md"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {userType === "Admin" && (
              <div className="admin">
                <label className="label">
                  <span className="label-text">Firs Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text">Middle Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="input input-bordered"
                />
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="input input-bordered"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="form-control">
        <div className="flex">
          <div className="relative w-full">
            <label className="label text-base font-semibold text-black">
              <span className="label-text text-base font-semibold text-black">
                Type
              </span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <option value="">Select an option</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="relative w-full">
            <label className="label">
              <span className="label-text text-base font-semibold text-black">
                Customer ID
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Customer ID"
              className="input input-bordered"
            />
          </div>

          <div className="relative w-full">
            <label className="label">
              <span className="label-text text-base font-semibold text-black">
                Name
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className="input input-bordered"
            />
          </div>
          <div className="relative w-full">
            <label className="label">
              <span className="label-text text-base font-semibold text-black">
                Email
              </span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="input input-bordered"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-5 text-black">
        <table className="table text-base font-semibold">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Package</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="row">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 2 */}
            <tr className="row">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*  To the person that would recode this or optimize this .... Good luck hahah */
"use client";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputPhone from "@/components/LabeledInputPhone";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import { useToast } from "@/hooks/useToast";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikProps } from "formik";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import "yup-phone-lite";
type vehicleType = {
  table_uuid: string;
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
  const { showToast } = useToast();
  const [showUsersType, setShowUsersType] = useState<string>("");
  const handleUserTypeChange = (event: any) => {
    setUserType(event.target.value);
  };
  const handleShowUserType = (event: any) => {
    setShowUsersType(event.target.value);
  };

  const countries = [
    {
      value: "Afghanistan",
      text: "Afghanistan",
    },
    {
      value: "Albania",
      text: "Albania",
    },
    {
      value: "Algeria",
      text: "Algeria",
    },
    {
      value: "Andorra",
      text: "Andorra",
    },
    {
      value: "Angola",
      text: "Angola",
    },
    {
      value: "Antigua and Barbuda",
      text: "Antigua and Barbuda",
    },
    {
      value: "Argentina",
      text: "Argentina",
    },
    {
      value: "Armenia",
      text: "Armenia",
    },
    {
      value: "Australia",
      text: "Australia",
    },
    {
      value: "Austria",
      text: "Austria",
    },
    {
      value: "Azerbaijan",
      text: "Azerbaijan",
    },
    {
      value: "Bahamas",
      text: "Bahamas",
    },
    {
      value: "Bahrain",
      text: "Bahrain",
    },
    {
      value: "Bangladesh",
      text: "Bangladesh",
    },
    {
      value: "Barbados",
      text: "Barbados",
    },
    {
      value: "Belarus",
      text: "Belarus",
    },
    {
      value: "Belgium",
      text: "Belgium",
    },
    {
      value: "Belize",
      text: "Belize",
    },
    {
      value: "Benin",
      text: "Benin",
    },
    {
      value: "Bhutan",
      text: "Bhutan",
    },
    {
      value: "Bolivia",
      text: "Bolivia",
    },
    {
      value: "Bosnia and Herzegovina",
      text: "Bosnia and Herzegovina",
    },
    {
      value: "Botswana",
      text: "Botswana",
    },
    {
      value: "Brazil",
      text: "Brazil",
    },
    {
      value: "Brunei",
      text: "Brunei",
    },
    {
      value: "Bulgaria",
      text: "Bulgaria",
    },
    {
      value: "Burkina Faso",
      text: "Burkina Faso",
    },
    {
      value: "Burundi",
      text: "Burundi",
    },
    {
      value: "Cabo Verde",
      text: "Cabo Verde",
    },
    {
      value: "Cambodia",
      text: "Cambodia",
    },
    {
      value: "Cameroon",
      text: "Cameroon",
    },
    {
      value: "Canada",
      text: "Canada",
    },
    {
      value: "Central African Republic",
      text: "Central African Republic",
    },
    {
      value: "Chad",
      text: "Chad",
    },
    {
      value: "Chile",
      text: "Chile",
    },
    {
      value: "China",
      text: "China",
    },
    {
      value: "Colombia",
      text: "Colombia",
    },
    {
      value: "Comoros",
      text: "Comoros",
    },
    {
      value: "Congo (Congo-Brazzaville)",
      text: "Congo (Congo-Brazzaville)",
    },
    {
      value: "Costa Rica",
      text: "Costa Rica",
    },
    {
      value: "Croatia",
      text: "Croatia",
    },
    {
      value: "Cuba",
      text: "Cuba",
    },
    {
      value: "Cyprus",
      text: "Cyprus",
    },
    {
      value: "Czechia (Czech Republic)",
      text: "Czechia (Czech Republic)",
    },
    {
      value: "Democratic Republic of the Congo",
      text: "Democratic Republic of the Congo",
    },
    {
      value: "Denmark",
      text: "Denmark",
    },
    {
      value: "Djibouti",
      text: "Djibouti",
    },
    {
      value: "Dominica",
      text: "Dominica",
    },
    {
      value: "Dominican Republic",
      text: "Dominican Republic",
    },
    {
      value: "Ecuador",
      text: "Ecuador",
    },
    {
      value: "Egypt",
      text: "Egypt",
    },
    {
      value: "El Salvador",
      text: "El Salvador",
    },
    {
      value: "Equatorial Guinea",
      text: "Equatorial Guinea",
    },
    {
      value: "Eritrea",
      text: "Eritrea",
    },
    {
      value: "Estonia",
      text: "Estonia",
    },
    {
      value: "Eswatini (fmr. Swaziland)",
      text: "Eswatini (fmr. Swaziland)",
    },
    {
      value: "Ethiopia",
      text: "Ethiopia",
    },
    {
      value: "Fiji",
      text: "Fiji",
    },
    {
      value: "Finland",
      text: "Finland",
    },
    {
      value: "France",
      text: "France",
    },
    {
      value: "Gabon",
      text: "Gabon",
    },
    {
      value: "Gambia",
      text: "Gambia",
    },
    {
      value: "Georgia",
      text: "Georgia",
    },
    {
      value: "Germany",
      text: "Germany",
    },
    {
      value: "Ghana",
      text: "Ghana",
    },
    {
      value: "Greece",
      text: "Greece",
    },
    {
      value: "Grenada",
      text: "Grenada",
    },
    {
      value: "Guatemala",
      text: "Guatemala",
    },
    {
      value: "Guinea",
      text: "Guinea",
    },
    {
      value: "Guinea-Bissau",
      text: "Guinea-Bissau",
    },
    {
      value: "Guyana",
      text: "Guyana",
    },
    {
      value: "Haiti",
      text: "Haiti",
    },
    {
      value: "Holy See",
      text: "Holy See",
    },
    {
      value: "Honduras",
      text: "Honduras",
    },
    {
      value: "Hungary",
      text: "Hungary",
    },
    {
      value: "Iceland",
      text: "Iceland",
    },
    {
      value: "India",
      text: "India",
    },
    {
      value: "Indonesia",
      text: "Indonesia",
    },
    {
      value: "Iran",
      text: "Iran",
    },
    {
      value: "Iraq",
      text: "Iraq",
    },
    {
      value: "Ireland",
      text: "Ireland",
    },
    {
      value: "Israel",
      text: "Israel",
    },
    {
      value: "Italy",
      text: "Italy",
    },
    {
      value: "Jamaica",
      text: "Jamaica",
    },
    {
      value: "Japan",
      text: "Japan",
    },
    {
      value: "Jordan",
      text: "Jordan",
    },
    {
      value: "Kazakhstan",
      text: "Kazakhstan",
    },
    {
      value: "Kenya",
      text: "Kenya",
    },
    {
      value: "Kiribati",
      text: "Kiribati",
    },
    {
      value: "Kuwait",
      text: "Kuwait",
    },
    {
      value: "Kyrgyzstan",
      text: "Kyrgyzstan",
    },
    {
      value: "Laos",
      text: "Laos",
    },
    {
      value: "Latvia",
      text: "Latvia",
    },
    {
      value: "Lebanon",
      text: "Lebanon",
    },
    {
      value: "Lesotho",
      text: "Lesotho",
    },
    {
      value: "Liberia",
      text: "Liberia",
    },
    {
      value: "Libya",
      text: "Libya",
    },
    {
      value: "Liechtenstein",
      text: "Liechtenstein",
    },
    {
      value: "Lithuania",
      text: "Lithuania",
    },
    {
      value: "Luxembourg",
      text: "Luxembourg",
    },
    {
      value: "Madagascar",
      text: "Madagascar",
    },
    {
      value: "Malawi",
      text: "Malawi",
    },
    {
      value: "Malaysia",
      text: "Malaysia",
    },
    {
      value: "Maldives",
      text: "Maldives",
    },
    {
      value: "Mali",
      text: "Mali",
    },
    {
      value: "Malta",
      text: "Malta",
    },
    {
      value: "Marshall Islands",
      text: "Marshall Islands",
    },
    {
      value: "Mauritania",
      text: "Mauritania",
    },
    {
      value: "Mauritius",
      text: "Mauritius",
    },
    {
      value: "Mexico",
      text: "Mexico",
    },
    {
      value: "Micronesia",
      text: "Micronesia",
    },
    {
      value: "Moldova",
      text: "Moldova",
    },
    {
      value: "Monaco",
      text: "Monaco",
    },
    {
      value: "Mongolia",
      text: "Mongolia",
    },
    {
      value: "Montenegro",
      text: "Montenegro",
    },
    {
      value: "Morocco",
      text: "Morocco",
    },
    {
      value: "Mozambique",
      text: "Mozambique",
    },
    {
      value: "Myanmar (formerly Burma)",
      text: "Myanmar (formerly Burma)",
    },
    {
      value: "Namibia",
      text: "Namibia",
    },
    {
      value: "Nauru",
      text: "Nauru",
    },
    {
      value: "Nepal",
      text: "Nepal",
    },
    {
      value: "Netherlands",
      text: "Netherlands",
    },
    {
      value: "New Zealand",
      text: "New Zealand",
    },
    {
      value: "Nicaragua",
      text: "Nicaragua",
    },
    {
      value: "Niger",
      text: "Niger",
    },
    {
      value: "Nigeria",
      text: "Nigeria",
    },
    {
      value: "North Korea",
      text: "North Korea",
    },
    {
      value: "North Macedonia (formerly Macedonia)",
      text: "North Macedonia (formerly Macedonia)",
    },
    {
      value: "Norway",
      text: "Norway",
    },
    {
      value: "Oman",
      text: "Oman",
    },
    {
      value: "Pakistan",
      text: "Pakistan",
    },
    {
      value: "Palau",
      text: "Palau",
    },
    {
      value: "Palestine State",
      text: "Palestine State",
    },
    {
      value: "Panama",
      text: "Panama",
    },
    {
      value: "Papua New Guinea",
      text: "Papua New Guinea",
    },
    {
      value: "Paraguay",
      text: "Paraguay",
    },
    {
      value: "Peru",
      text: "Peru",
    },
    {
      value: "Philippines",
      text: "Philippines",
    },
    {
      value: "Poland",
      text: "Poland",
    },
    {
      value: "Portugal",
      text: "Portugal",
    },
    {
      value: "Qatar",
      text: "Qatar",
    },
    {
      value: "Romania",
      text: "Romania",
    },
    {
      value: "Russia",
      text: "Russia",
    },
    {
      value: "Rwanda",
      text: "Rwanda",
    },
    {
      value: "Saint Kitts and Nevis",
      text: "Saint Kitts and Nevis",
    },
    {
      value: "Saint Lucia",
      text: "Saint Lucia",
    },
    {
      value: "Saint Vincent and the Grenadines",
      text: "Saint Vincent and the Grenadines",
    },
    {
      value: "Samoa",
      text: "Samoa",
    },
    {
      value: "San Marino",
      text: "San Marino",
    },
    {
      value: "Sao Tome and Principe",
      text: "Sao Tome and Principe",
    },
    {
      value: "Saudi Arabia",
      text: "Saudi Arabia",
    },
    {
      value: "Senegal",
      text: "Senegal",
    },
    {
      value: "Serbia",
      text: "Serbia",
    },
    {
      value: "Seychelles",
      text: "Seychelles",
    },
    {
      value: "Sierra Leone",
      text: "Sierra Leone",
    },
    {
      value: "Singapore",
      text: "Singapore",
    },
    {
      value: "Slovakia",
      text: "Slovakia",
    },
    {
      value: "Slovenia",
      text: "Slovenia",
    },
    {
      value: "Solomon Islands",
      text: "Solomon Islands",
    },
    {
      value: "Somalia",
      text: "Somalia",
    },
    {
      value: "South Africa",
      text: "South Africa",
    },
    {
      value: "South Korea",
      text: "South Korea",
    },
    {
      value: "South Sudan",
      text: "South Sudan",
    },
    {
      value: "Spain",
      text: "Spain",
    },
    {
      value: "Sri Lanka",
      text: "Sri Lanka",
    },
    {
      value: "Sudan",
      text: "Sudan",
    },
    {
      value: "Suriname",
      text: "Suriname",
    },
    {
      value: "Sweden",
      text: "Sweden",
    },
    {
      value: "Switzerland",
      text: "Switzerland",
    },
    {
      value: "Syria",
      text: "Syria",
    },
    {
      value: "Tajikistan",
      text: "Tajikistan",
    },
    {
      value: "Tanzania",
      text: "Tanzania",
    },
    {
      value: "Thailand",
      text: "Thailand",
    },
    {
      value: "Timor-Leste",
      text: "Timor-Leste",
    },
    {
      value: "Togo",
      text: "Togo",
    },
    {
      value: "Tonga",
      text: "Tonga",
    },
    {
      value: "Trinidad and Tobago",
      text: "Trinidad and Tobago",
    },
    {
      value: "Tunisia",
      text: "Tunisia",
    },
    {
      value: "Turkey",
      text: "Turkey",
    },
    {
      value: "Turkmenistan",
      text: "Turkmenistan",
    },
    {
      value: "Tuvalu",
      text: "Tuvalu",
    },
    {
      value: "Uganda",
      text: "Uganda",
    },
    {
      value: "Ukraine",
      text: "Ukraine",
    },
    {
      value: "United Arab Emirates",
      text: "United Arab Emirates",
    },
    {
      value: "United Kingdom",
      text: "United Kingdom",
    },
    {
      value: "United States of America",
      text: "United States of America",
    },
    {
      value: "Uruguay",
      text: "Uruguay",
    },
    {
      value: "Uzbekistan",
      text: "Uzbekistan",
    },
    {
      value: "Vanuatu",
      text: "Vanuatu",
    },
    {
      value: "Venezuela",
      text: "Venezuela",
    },
    {
      value: "Vietnam",
      text: "Vietnam",
    },
    {
      value: "Yemen",
      text: "Yemen",
    },
    {
      value: "Zambia",
      text: "Zambia",
    },
    {
      value: "Zimbabwe",
      text: "Zimbabwe",
    },
  ];
  const confirmBox = useRef<HTMLInputElement>(null);
  const CustomerAccountDetail = useRef<FormikProps<any>>(null);
  const VehicleDetail = useRef<FormikProps<any>>(null);
  const notificationContainer = useRef<HTMLDivElement>(null);
  const EmployeeForm = useRef<FormikProps<any>>(null);
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
  const [adminPhone, setAdminPhone] = useState<phoneType>({
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
    async function init() {}
    init();
  }, []);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
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
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
  const [vehiclelist, setVehicleList] = useState<vehicleType[]>([]);
  const customerValidation = yup.object({
    first_name: yup.string().required("First Name is required."),
    middle_name: yup.string(),
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
    address_line: yup.string().required("Address Line is required"),
    address_line2: yup.string(),
    city: yup.string().required("City is required"),
    state_province_region: yup
      .string()
      .required("State/Province/Region is required"),
    zip_code: yup.string().required("Zip/Postal Code is required"),
    country: yup.string().required("Country is required"),
  });
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

  const adminSchema = yup.object().shape({
    phone_number: yup
      .string()
      .phone(
        adminPhone?.iso2.toUpperCase(),
        `Enter a valid phone number for ${adminPhone?.name}`
      )
      .required("Phone Number is required."),
    first_name: yup.string().required("First Name is required."),
    middle_name: yup.string(),
    last_name: yup.string().required("Last Name is required."),
    email: yup.string().email().required("Email is required."),
  });

  const [dataToRemove, setDataToRemove] = useState<{
    id: string;
    table_uuid: string;
  }>();
  const [createUserMessage, setCreateUserMessage] = useState<string>("");
  const confirmModal = useRef<HTMLDialogElement>(null);
  const modalAddUser = useRef<HTMLInputElement>(null);
  const notifModal = useRef<HTMLDialogElement>(null);
  const AdminForm = useRef<FormikProps<any>>(null);
  const CreateEmployeeMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch("/api/private/createEmployee", {
        method: "POST",
        body: JSON.stringify(values),
        headers: headersList,
      });
      return response.json();
    },
    onSuccess: async (data: any) => {
      console.log(data);
      if (data.code == 200) {
        setCreateUserMessage(data.message);
        notifModal.current?.showModal();
        EmployeeForm.current?.resetForm();
      } else {
        showToast({
          status: "error",
          message: data.message,
        });
      }
    },
    onError: async (error: any) => {
      showToast({
        status: "error",
        message: error.message,
      });
    },
  });
  const CreateCustomerMutation = useMutation({
    mutationFn: async (values: any) => {
      console.log(values);
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch("/api/private/createCustomer", {
        method: "POST",
        body: JSON.stringify(values),
        headers: headersList,
      });
      return response.json();
    },
    onSuccess: async (data: any) => {
      new QueryClient().invalidateQueries({
        queryKey: ["getPackages"],
      });
      console.log(data);
      if (data.code == 200) {
        setCreateUserMessage(data.message);
        notifModal.current?.showModal();
      } else {
        showToast({
          status: "error",
          message: data.message,
        });
      }
    },
    onError: async (error: any) => {
      showToast({
        status: "error",
        message: error.message,
      });
    },
  });

  return (
    <div className="pl-10 z-10">
      {/* Dialog Modal for notifying admin / sales man that customer was created succesfully */}

      <dialog id="my_modal_1" ref={notifModal} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New {userType} Account </h3>
          <p className="py-4">{createUserMessage}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  notifModal.current?.close();
                  CustomerAccountDetail.current?.resetForm();
                  VehicleDetail.current?.resetForm();
                  setVehicleList([]);
                }}
                className="btn"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Dialog for removal of car on the list */}
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
            Are you sure you want to remove <b>{dataToRemove?.id}</b> ?
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
              <option value="employee">Employee</option>
            </select>
            {userType === "Customer" && (
              <>
                <div className="divider uppercase">Customer Information</div>
                <Formik
                  innerRef={CustomerAccountDetail}
                  initialValues={{
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    points: "",
                    package: "",
                    address_line: "",
                    address_line2: "",
                    city: "",
                    state_province_region: "",
                    zip_code: "",
                    country: "",
                    suffix: "",
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
                          field_name="middle_name"
                          type="text"
                          placeholder="Enter Middle Name"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.middle_name}
                          touched={touched.middle_name}
                          classes="text-base"
                          label="Middle Name"
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
                          field_name="suffix"
                          type="text"
                          placeholder="Suffix"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.suffix}
                          touched={touched.suffix}
                          classes="text-base"
                          label="Suffix"
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
                        />{" "}
                        <LabeledSelectInput
                          field_name="country"
                          type="text"
                          placeholder="Select Country"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.country}
                          touched={touched.country}
                          classes="text-base"
                          label="Country"
                          SelectOptions={countries}
                          setFieldValue={setFieldValue}
                          values={values.country}
                        />
                        <LabeledInput
                          field_name="address_line"
                          type="text"
                          placeholder="Enter Address Line"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.address_line}
                          touched={touched.address_line}
                          classes="text-base"
                          label="Address Line"
                        />
                        <LabeledInput
                          field_name="address_line2"
                          type="text"
                          placeholder="Enter Address Line 2"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.address_line2}
                          touched={touched.address_line2}
                          classes="text-base"
                          label="Address Line 2"
                        />
                        <LabeledInput
                          field_name="city"
                          type="text"
                          placeholder="Enter City"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.city}
                          touched={touched.city}
                          classes="text-base"
                          label="City"
                        />
                        <LabeledInput
                          field_name="state_province_region"
                          type="text"
                          placeholder="Enter State/Province/Region"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.state_province_region}
                          touched={touched.state_province_region}
                          classes="text-base"
                          label="State/Province/Region"
                        />
                        <LabeledInput
                          field_name="zip_code"
                          type="text"
                          placeholder="Enter Zip Code"
                          className="input input-bordered  input-sm w-full max-w-xs"
                          errors={errors.zip_code}
                          touched={touched.zip_code}
                          classes="text-base"
                          label="Zip/Postal Code"
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="divider uppercase">Vehicle Information</div>
                <Formik
 
 innerRef={VehicleDetail}
                  initialValues={{
                    year: "",
                    model: "",
                    trim: "",
                    color: "",
                    vin_no: "",
                  }}
                  validationSchema={vehicleSchema}
                  onSubmit={async (values: any) => {
                    if (
                      vehiclelist.find((item) => item.vin_no === values.vin_no)
                    ) {
                      toast.error("Vehicle ID already exists in the list");
                    } else {
                      const formatted_values = {
                        table_uuid: Math.random().toString(36).substring(7),
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
                      VehicleDetail.current?.resetForm();
                    }
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
                      <button className="btn btn-primary mt-4">
                        Add Vehicle
                      </button>

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
                          {vehiclelist.map((vehicle) => (
                            <tr key={vehicle.table_uuid}>
                              <td>{vehicle.vin_no}</td>
                              <td>{vehicle.year}</td>
                              <td>{vehicle.model}</td>
                              <td>{vehicle.trim}</td>
                              <td>{vehicle.color}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-error"
                                  onClick={() => {
                                    setDataToRemove({
                                      id: vehicle.vin_no,
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
                    onClick={async () => {
                      if (
                        CustomerAccountDetail.current?.isValid &&
                        vehiclelist.length != 0
                      ) {
                        let bodyContent = {
                          firstName:
                            CustomerAccountDetail.current?.values.first_name,
                          middleName:
                            CustomerAccountDetail.current?.values.middle_name,
                          lastName:
                            CustomerAccountDetail.current?.values.last_name,
                          phoneNumber:
                            CustomerAccountDetail.current?.values.phone_number,
                          email: CustomerAccountDetail.current?.values.email,
                          packageId:
                            CustomerAccountDetail.current?.values.package,
                          vehicles: vehiclelist,
                          country:
                            CustomerAccountDetail.current?.values.country,
                          city: CustomerAccountDetail.current?.values.city,
                          zipCode:
                            CustomerAccountDetail.current?.values.zip_code,
                          address:
                            CustomerAccountDetail.current?.values.address_line,
                          address2:
                            CustomerAccountDetail.current?.values.address_line2,
                          state_province:
                            CustomerAccountDetail.current?.values
                              .state_province_region,
                          points: CustomerAccountDetail.current?.values.points,
                          suffix: CustomerAccountDetail.current?.values.suffix,
                        };

                        CreateCustomerMutation.mutate(bodyContent);
                      } else {
                        toast.error("Please fill up all the required fields");
                      }
                    }}
                    className="btn btn-info btn-md"
                  >
                    Create Customer
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

            {userType === "employee" && (
              <div className="admin">
                <Formik
                  innerRef={EmployeeForm}
                  initialValues={{
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    email: "",
                    phone_nuber: "",
                    employee_type: "",
                    suffix: "",
                  }}
                  validationSchema={adminSchema}
                  onSubmit={(values: any) => {}}
                >
                  {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                      <div className=" grid grid-cols-3 gap-2">
                        <LabeledSelectInput
                          field_name="employee_type"
                          type="text"
                          placeholder="Select Employee Type"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.employee_type}
                          touched={touched.employee_type}
                          classes="text-base"
                          label="Employee Type"
                          SelectOptions={[
                            {
                              value: "3",
                              text: "Sales",
                            },
                            {
                              value: "2",
                              text: "Admin",
                            },
                          ]}
                          setFieldValue={setFieldValue}
                          values={values.employee_type}
                        />
                        <LabeledInput
                          field_name="firstName"
                          type="text"
                          placeholder="Enter First Name"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.firstName}
                          touched={touched.firstName}
                          classes="text-base"
                          label="First Name"
                        />
                        <LabeledInput
                          field_name="middleName"
                          type="text"
                          placeholder="Enter Middle Name"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.middleName}
                          touched={touched.middleName}
                          classes="text-base"
                          label="Middle Name"
                        />
                        <LabeledInput
                          field_name="lastName"
                          type="text"
                          placeholder="Enter Last Name"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.lastName}
                          touched={touched.lastName}
                          classes="text-base"
                          label="Last Name"
                        />
                        <LabeledInput
                          field_name="suffix"
                          type="text"
                          placeholder="Suffix"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.suffix}
                          touched={touched.suffix}
                          classes="text-base"
                          label="Suffix"
                        />
                        <LabeledInput
                          field_name="email"
                          type="email"
                          placeholder="Enter Email"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.email}
                          touched={touched.email}
                          classes="text-base"
                          label="Email"
                        />
                        <LabeledInputPhone
                          field_name="phone_number"
                          placeholder="Enter Phone Number"
                          className="input input-bordered input-sm w-full max-w-xs"
                          errors={errors.phone_number}
                          touched={touched.phone_number}
                          classes="text-base"
                          label="Phone Number"
                          value={values.phone_number}
                          setFieldValue={setFieldValue}
                          setPhoneInfo={setAdminPhone}
                          costumerValidation={customerValidation}
                        />
                      </div>
                      <div className="modal-action">
                        <button
                          onClick={() => {
                            console.log(values);
                            const bodyContent = {
                              first_name: values.firstName,
                              middle_name: values.middleName,
                              last_name: values.lastName,
                              email: values.email,
                              phone_number: values.phone_number,
                              employee_type: values.employee_type,
                              suffix: values.suffix,
                            };
                            CreateEmployeeMutation.mutate(bodyContent);
                          }}
                          type="submit"
                          className="btn btn-primary"
                        >
                          Create Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            modalAddUser.current?.click();
                          }}
                          className="btn btn-md"
                        >
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="form-control mt-4">
        <div className="flex">
          <div className="relative w-full">
            <div className="join">
              <div>
                <div>
                  <input
                    className="input input-bordered join-item"
                    placeholder="Search"
                  />
                </div>
              </div>
              <select
                value={showUsersType}
                onChange={handleShowUserType}
                className="select select-bordered join-item"
              >
                <option disabled value="">
                  Filter
                </option>
                <option value="Customer">Customer</option>
                <option value="Employee">Employee</option>
              </select>
              <div className="indicator">
                <button className="btn join-item">Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-5 text-black">
        {showUsersType == "" ? (
          <table className="table text-base font-semibold">
            {/* head */}
            <thead className="bg-gray-900 rounded-lg text-white font-semibold">
              <tr className="rounded-lg">
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 3 */}
              <tr className="row">
                <th className="text-center" colSpan={6}>
                  Please select user type filter above .
                </th>
              </tr>
            </tbody>
          </table>
        ) : showUsersType == "Customer" ? (
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

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
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
                <td>
                  <button className="btn btn-sm btn-info mr-5">Edit</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
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

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
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
                <td>
                  <button className="btn btn-sm btn-info mr-5">Edit</button>
                  <button className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/*  To the person that would recode this or optimize this .... Good luck hahah */
"use client";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputPhone from "@/components/LabeledInputPhone";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import NormalInput from "@/components/NormalInput";
import SelectInput from "@/components/SelectInput";
import { useToast } from "@/hooks/useToast";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import "yup-phone-lite";
import Image from "next/image";
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
  const nav = useRouter();
  const [keyword, setKeyword] = useState<string>("");
  const [userType, setUserType] = useState("");
  const [page, setPage] = useState(0);
  const modalForm = useRef<HTMLDialogElement>(null);
  const searchForm = useRef<FormikProps<any>>(null);
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

      let response = await fetch("/api/private/displayPackages", {
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
    vin_no: yup
      .string()
      .matches(
        /^[A-HJ-NPR-Z0-9]{17}$/i,
        "Please enter a valid Vehicle Identification Numner (VIN)"
      )
      .required("Vehicle Identification Numner (VIN) is required"),
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
      if (data.code == 200) {
        searchForm.current?.resetForm();
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

  const getVehicle = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch("/api/private/getVehicleInformation", {
        method: "POST",
        body: JSON.stringify(values),
        headers: headersList,
      });
      return response.json();
    },
    onSuccess: async (data: any) => {
      console.log(data);
      if (data.code == 200) {
        console.log(data.data);
        const formatted_values = {
          table_uuid: Math.random().toString(36).substring(7),
          year: data.data[0].year,
          model: data.data[0].model,
          trim: data.data[0].trim,
          color: data.data[0].color,
          vin_no: data.data[0].vin_id,
        };
        setVehicleList((oldList) => [...oldList, formatted_values]);
        VehicleDetail.current?.resetForm();
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
    <div className="w-full h-full pl-10 ">
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
      </dialog>{" "}
      <h3 className="font-bold text-lg">Add User</h3>
      <div className="w-full h-full md:h-[300px] lg:h-[480px] xl:h-[800px] overflow-y-auto  flex flex-col">
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
                  datatip="Input the first name for the account"
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
                  datatip="Input the middle name for the account"
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
                  datatip="Input the last name for the account"
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
                  datatip="Input the suffix for the account"
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
                  datattip="Input the email for the account"
                />
                <LabeledInputPhone
                  field_name="phone_number"
                  placeholder="Enter Phone Number"
                  className="input input-bordered  input-sm w-full max-w-xs"
                  errors={errors.phone_number}
                  touched={touched.phone_number}
                  classes="text-base"
                  label="Phone Number"
                  datatip="Input the phone number for the account"
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
                  datatip="Input the points for the account"
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
                  datatip="Select the package for the account"
                  SelectOptions={isFetching || isLoading ? [] : data.data}
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
                  datatip="Select the country for the account"
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
                  datatip="Input the address line for the account"
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
                  datatip="Input the address line 2 for the account"
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
                  datatip="Input the city for the account"
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
                  datatip="Input the state/province/region for the account"
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
                  datatip="Input the zip/postal code for the account"
                />
              </div>
            </Form>
          )}
        </Formik>
        <div className="divider uppercase">Vehicle Information</div>
        <Formik
          innerRef={VehicleDetail}
          initialValues={{
            vin_no: "",
          }}
          validationSchema={vehicleSchema}
          onSubmit={async (values: any) => {}}
        >
          {({ errors, touched, values }) => (
            <Form>
              <div className="grid grid-cols-3 gap-x-2">
                <LabeledInput
                  field_name="vin_no"
                  type="text"
                  placeholder="Enter Vehicle Identification Numner (VIN)"
                  className="input input-bordered input-sm w-full max-w-xs"
                  errors={errors.vin_no}
                  touched={touched.vin_no}
                  classes="text-base"
                  label="Vehicle Identification Numner (VIN)"
                  datatip="Input the Vehicle Identification Numner (VIN) for the vehicle of the account."
                />
              </div>
              <div id="notif" ref={notificationContainer}></div>
              <button
                type={"button"}
                onClick={async (e: any) => {
                  if (
                    vehiclelist.find((item) => item.vin_no === values.vin_no)
                  ) {
                    toast.error("Vehicle ID already exists in the list");
                  } else {
                    await getVehicle.mutate(values);
                  }
                }}
                className="btn btn-primary mt-4"
              >
                Add Vehicle
              </button>
            </Form>
          )}
        </Formik>
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
                <td>{vehicle.color == null ? "N/A" : vehicle.color}</td>
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
        <div className="modal-action">
          <button
            onClick={async () => {
              if (
                CustomerAccountDetail.current?.isValid &&
                vehiclelist.length != 0
              ) {
                let bodyContent = {
                  firstName: CustomerAccountDetail.current?.values.first_name,
                  middleName: CustomerAccountDetail.current?.values.middle_name,
                  lastName: CustomerAccountDetail.current?.values.last_name,
                  phoneNumber:
                    CustomerAccountDetail.current?.values.phone_number,
                  email: CustomerAccountDetail.current?.values.email,
                  packageId: CustomerAccountDetail.current?.values.package,
                  vehicles: vehiclelist,
                  country: CustomerAccountDetail.current?.values.country,
                  city: CustomerAccountDetail.current?.values.city,
                  zipCode: CustomerAccountDetail.current?.values.zip_code,
                  address: CustomerAccountDetail.current?.values.address_line,
                  address2: CustomerAccountDetail.current?.values.address_line2,
                  state_province:
                    CustomerAccountDetail.current?.values.state_province_region,
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
      </div>
    </div>
  );
}

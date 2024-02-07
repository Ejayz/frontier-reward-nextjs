"use client";

import Loading from "@/app/(index)/loading";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputPhone from "@/components/LabeledInputPhone";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import { useToast } from "@/hooks/useToast";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikProps } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import "yup-phone-lite";
import Link from "next/link";
type phoneType = {
  areaCodes: number[] | undefined;
  dialCode: string;
  format: string;
  iso2: string;
  name: string;
  priority: number;
};
export default function Page() {
  const params = useSearchParams();
  const nav = useRouter();
  const CustomerAccountDetail = useRef<FormikProps<any>>(null);

  const { showToast } = useToast();
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

  const EmployeeForm = useRef<FormikProps<any>>(null);

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
  const [toShow, setToShow] = useState<boolean>(false);
  useEffect(() => {
    if (params?.get("user_id") == undefined) {
      toast.error("User ID is required");
      nav.push("/superadmin/customer");
    }
  }, [params?.get("user_id")]);

  const notificationContainer = useRef<HTMLDivElement>(null);

  const [dataToRemove, setDataToRemove] = useState<{
    id: string;
    table_uuid: string;
    isFromDb?: boolean;
  }>();

  const confirmModal = useRef<HTMLDialogElement>(null);

  const [createUserMessage, setCreateUserMessage] = useState<string>("");

  const notifModal = useRef<HTMLDialogElement>(null);

  const UpdateCustomerMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch("/api/private/updateCustomerInformation", {
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
        toast.success(data.message);
        nav.push("/superadmin/users");
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

  const modalAddUser = useRef<HTMLInputElement>(null);

  const {
    data: EmployeeData,
    isLoading: EmployeeisLoading,
    error: EmployeeError,
    isFetching: EmployeeIsFetching,
  } = useQuery({
    queryKey: ["getEmployee", params?.get("user_id")],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(
        `/api/private/getEmployeeInfo/?user_id=${params?.get("user_id")}`,
        {
          method: "GET",
          headers: headersList,
        }
      );
      const data = await response.json();
      if (data.code == 200) {
        setToShow(true);
      }
      return data;
    },
  });

  const defValue = {
    firstName: EmployeeData?.data[0]?.first_name || "",
    middleName: EmployeeData?.data[0]?.middle_name || "",
    lastName: EmployeeData?.data[0]?.last_name || "",
    email: EmployeeData?.data[0]?.email || "",
    phone_number: EmployeeData?.data[0]?.phone_number || "",
    employee_type: EmployeeData?.data[0]?.user_type || "",
    suffix: EmployeeData?.data[0]?.suffix || "",
    CoreId: EmployeeData?.data[0]?.CoreId || "",
    User_Id: EmployeeData?.data[0]?.user_id || "",
  };

  const updateUsermutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      let response = await fetch("/api/private/updateEmployeeInfo", {
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
        toast.success(data.message);
        nav.push("/superadmin/users");
        nav.push("/superadmin/users");
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

  if (!toShow) {
    return <Loading />;
  } else {
    return (
      <div className="w-full h-full overflow-y-scroll">
        <Formik
          enableReinitialize={true}
          innerRef={EmployeeForm}
          initialValues={
            EmployeeisLoading || EmployeeIsFetching
              ? {
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  email: "",
                  phone_number: "",
                  employee_type: "",
                  suffix: "",
                  CoreId: "",
                  User_Id: "",
                }
              : defValue
          }
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
                      value: 3,
                      text: "Sales",
                    },
                    {
                      value: 2,
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
                  costumerValidation={adminSchema}
                />
              </div>
              <div className="card-actions flex flex-row justify-end">
                <button
                  onClick={() => {
                    updateUsermutation.mutate({
                      first_name: values.firstName,
                      middle_name: values.middleName,
                      last_name: values.lastName,
                      email: values.email,
                      phone_number: values.phone_number,
                      employee_type: values.employee_type,
                      suffix: values.suffix,
                      CoreId: values.CoreId,
                      User_Id: values.User_Id,
                    });
                  }}
                  type="submit"
                  className="btn btn-primary mx-2"
                >
                  Update Employee
                </button>
                <Link href={"/superadmin/users"} className="btn  mx-2">
                  Cancel
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

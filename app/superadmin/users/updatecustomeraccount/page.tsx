"use client";

import Loading from "@/app/(index)/loading";
import LabeledInput from "@/components/LabeledInput";
import LabeledInputPhone from "@/components/LabeledInputPhone";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import { useToast } from "@/hooks/useToast";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikProps } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import "yup-phone-lite";
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
      nav.push("/superadmin/users");
    }
  }, [params?.get("user_id")]);
  const {
    data: CustomerInfo,
    error: CustomerInfoError,
    isLoading: CustomerInfoLoading,
    isFetching: CustomerInfoFetching,
    refetch: CustomerInfoRefetch,
  } = useQuery({
    queryKey: ["getCustomerInfo", params?.get("user_id") != undefined],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `/api/private/getCustomerInfo/?user_id=${params?.get("user_id")}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
      }
      if (data.code == 200) {
        setToShow(true);
        return data;
      } else {
        toast.error(data.message);
        nav.push("/superadmin/users");
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!CustomerInfoLoading || !CustomerInfoFetching || !CustomerInfoError) {
    }
  }, [CustomerInfo]);

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

  const { data, isLoading, isFetching, refetch } = useQuery({
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
  const FormValuesUpdate = {
    first_name:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].first_name
        : "",
    middle_name:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].middle_name
        : "",
    last_name:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].last_name
        : "",
    email:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].email
        : "",
    phone_number:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].phone_number
        : "",
    points:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].points
        : 0,
    package:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].package_id
        : "",
    address_line:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].address_1
        : "",
    address_line2:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].address_2
        : "",
    city:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].city
        : "",
    state_province_region:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].state_province
        : "",
    zip_code:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].zip_code
        : "",
    country:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].country
        : "",
    suffix:
      !CustomerInfoFetching || !CustomerInfoLoading
        ? CustomerInfo.data[0].suffix == "N/A" ||
          CustomerInfo.data[0].suffix == null
          ? ""
          : CustomerInfo.data[0].suffix
        : "",
  };
  console.log(CustomerInfo);
  console.log(data);
  if (!toShow) {
    return <Loading />;
  } else {
    return (
      <div className="w-full h-full overflow-y-scroll">
        <div className="divider uppercase ">Customer Information</div>
        <Formik
          enableReinitialize={true}
          innerRef={CustomerAccountDetail}
          initialValues={
            CustomerInfoFetching || CustomerInfoLoading
              ? {
                  first_name: "",
                  middle_name: "",
                  last_name: "",
                  email: "",
                  phone_number: "",
                  points: 0,
                  package: "",
                  address_line: "",
                  address_line2: "",
                  city: "",
                  state_province_region: "",
                  zip_code: "",
                  country: "",
                  suffix: "",
                }
              : FormValuesUpdate
          }
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
        <div className="card-actions justify-end mb-24">
          <button
            onClick={async () => {
              if (CustomerAccountDetail.current?.isValid) {
                let bodyContent = {
                  CoreId: CustomerInfo.data[0].CoreId,
                  UserId: CustomerInfo.data[0].UserId,
                  firstName: CustomerAccountDetail.current?.values.first_name,
                  middleName: CustomerAccountDetail.current?.values.middle_name,
                  lastName: CustomerAccountDetail.current?.values.last_name,
                  phoneNumber:
                    CustomerAccountDetail.current?.values.phone_number,
                  email: CustomerAccountDetail.current?.values.email,
                  packageId: CustomerAccountDetail.current?.values.package,
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

                UpdateCustomerMutation.mutate(bodyContent);
              } else {
                toast.error("Please fill up all the required fields");
              }
            }}
            className="btn btn-info btn-md mx-4"
          >
            Update Customer Information
          </button>{" "}
          <Link href={"/superadmin/users"} className="btn  mx-2">
            Cancel
          </Link>
        </div>
      </div>
    );
  }
}

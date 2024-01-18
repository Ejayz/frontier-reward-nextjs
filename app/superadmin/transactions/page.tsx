"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import SelectInput from "@/components/SelectInput";
import NormalInput from "@/components/NormalInput";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { randomUUID } from "crypto";

type rewardslist = {
  name: string;
  description: string;
  type: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  removed_at: string;
};

export default function Page() {
  const nav = useRouter();
  const searchForm = useRef<FormikProps<any>>(null);
  const [campaignPage, setCampaignPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const showConfirmCampaignTransaction = useRef<HTMLDialogElement>(null);
  const [campaignTransactionId, setCampaignTransactionID] = useState<any>();
  const [showPage, setShowPage] = useState(false);
  const {
    data: CampaignData,
    isLoading: campaignIsLoading,
    isFetching: campaignIsFetching,
    refetch: campaignRefetch,
  } = useQuery({
    queryKey: ["campaigns", campaignPage, searchForm.current?.values.keyword],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `/api/private/getCampaignTransactions?page=${campaignPage}&keyword=${searchForm.current?.values.keyword}`,
        {
          method: "GET",
          headers: headersList,
        }
      );
      const data = await response.json();
      if (data.code == 200) {
        setShowPage(true);
      } else if (data.code == 401) {
        nav.push("/login");
      }
      return data;
    },
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    console.log(CampaignData);
  }, [CampaignData]);

  const {
    data: CampaignTransactionInfo,
    isLoading: CampaignTransactionInfoIsLoading,
    isFetching: CampaignTransactionInfoIsFetching,
    refetch: CampaignTransactionInfoRefetch,
  } = useQuery({
    queryKey: ["campaigntransactioninfo", campaignTransactionId != null],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `/api/private/getCampaignTransactionInfo?id=${campaignTransactionId}`,
        {
          method: "GET",
          headers: headersList,
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.code == 401) {
        nav.push("/login");
      }
      return data;
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });
  if (!showPage) {
    return <Loading></Loading>;
  } else {
    return (
      <div className="overflow-x-auto mt-5 text-black">
        <dialog
          ref={showConfirmCampaignTransaction}
          id="my_modal_1"
          className="modal"
        >
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-black absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="flex flex-col w-full">
              <h3 className="font-bold text-xl">Campaign Transaction</h3>
              <span className=" text-gray-500 text-base">
                #
                {CampaignTransactionInfoIsFetching ||
                CampaignTransactionInfoIsLoading ? (
                  <>...</>
                ) : CampaignTransactionInfo != null ? (
                  CampaignTransactionInfo.transaction_no
                ) : (
                  <></>
                )}
              </span>
              <br></br>
              <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                Actions and Rewards
              </h2>

              <div className="flex flex-col gap-2.5">
                {CampaignTransactionInfoIsFetching ||
                CampaignTransactionInfoIsLoading ? (
                  <>...</>
                ) : CampaignTransactionInfo != null ? (
                  <>
                    {CampaignTransactionInfo.data.map(
                      (action: any, index: number) => (
                        <div
                          className="grid grid-cols-1 gap-2  rounded-md border p-5 cursor-pointer"
                          key={index}
                        >
                          <h3 className="mb-1.5 font-semibold leading-none">
                            {action.action_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action.action_description}
                          </p>

                          <ul className="mt-2.5 flex gap-1.5 text-xs font-medium ">
                            {action.data.map((reward: any, index: number) => (
                              <li
                                className="rounded-full border bg-gray-50 px-2 py-1 text-gray-600"
                                key={index}
                              >
                                {reward.reward_name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="mt-5 grid w-full grid-cols-4 gap-2.5">
                <button className=" col-span-1 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:border-white hover:bg-neutral-800 hover:text-white">
                  Deny
                </button>
                <button className=" col-span-3 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:border-white hover:bg-neutral-800 hover:text-white">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </dialog>
        <Formik
          innerRef={searchForm}
          initialValues={{
            keyword: "",
            selected: "",
          }}
          onSubmit={(values: any) => {
            if (values.selected == "campaign") {
              campaignRefetch();
            } else if (values.selected == "redeem") {
            }
          }}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form>
              <div className="form-control w-11/12 mx-auto mt-4">
                <div className="flex">
                  <div className="relative w-full">
                    <div className="join">
                      <div>
                        <div>
                          <NormalInput
                            field_name="keyword"
                            type="text"
                            placeholder="Search"
                            className="input input-bordered join-item"
                            errors={errors.keyword}
                            touched={touched.keyword}
                            onChange={(e: any) => {
                              setKeyword(e.target.value);
                            }}
                            classes="text-base"
                            label="Search"
                          />
                        </div>
                      </div>
                      <SelectInput
                        field_name="selected"
                        className="select select-bordered join-item"
                        placeholder="Transaction Type"
                        SelectOptions={[
                          {
                            value: "redeem",
                            text: "Redeem",
                          },
                          {
                            value: "campaign",
                            text: "Campaign",
                          },
                        ]}
                        errors={errors.selected}
                        touched={touched.selected}
                        setFieldValue={setFieldValue}
                        values={values.selected}
                      />

                      <div className="indicator">
                        <button className="btn join-item">Search</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto mt-5 flex flex-col w-full text-black">
                {values.selected == "" ? (
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
                ) : values.selected == "campaign" ? (
                  <>
                    <div className="flex flex-col w-11/12 mx-auto">
                      <table className="table w-10/12 text-base mx-auto font-semibold">
                        {/* head */}
                        <thead className="bg-gray-900 rounded-lg text-white font-semibold">
                          <tr className="rounded-lg">
                            <th>Transaction #</th>
                            <th>Campaign Name</th>
                            <th>Employee Name</th>
                            <th>Customer Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaignIsFetching || campaignIsLoading ? (
                            <tr className="text-center">
                              <td colSpan={6}>
                                Getting Campaign Transaction List.
                              </td>
                            </tr>
                          ) : CampaignData.data.length === 0 ? (
                            <tr className="text-center">
                              <td colSpan={6}>
                                No campaign Transaction Found.
                              </td>
                            </tr>
                          ) : (
                            CampaignData.data.map(
                              (campaign_transaction: any, index: number) => (
                                <tr key={index} className="row">
                                  <th>{campaign_transaction.transaction_no}</th>
                                  <td>{campaign_transaction.campaign_name}</td>
                                  <td>
                                    {campaign_transaction.EmployeeFullName}
                                  </td>
                                  <td>
                                    {campaign_transaction.CustomerFullName}
                                  </td>
                                  <td className="uppercase">
                                    {campaign_transaction.transaction_status}
                                  </td>
                                  <td>
                                    <button
                                      onClick={async () => {
                                        await setCampaignTransactionID(
                                          campaign_transaction.CoreId
                                        );
                                        await CampaignTransactionInfoRefetch();
                                        if (
                                          CampaignTransactionInfoIsFetching ||
                                          CampaignTransactionInfoIsLoading
                                        ) {
                                          setShowPage(false);
                                        } else {
                                          showConfirmCampaignTransaction.current?.showModal();
                                        }
                                      }}
                                      type="button"
                                      className="btn btn-info mr-5"
                                    >
                                      <Image
                                        src="/images/update-user.png"
                                        alt="edit"
                                        width={20}
                                        height={20}
                                      />
                                      <span>Show Transaction</span>
                                    </button>
                                  </td>
                                </tr>
                              )
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="w-11/12 flex mx-auto">
                        <div className="join mx-auto">
                          <button
                            type="button"
                            onClick={() => {
                              if (campaignPage !== 0) {
                                const newPage = campaignPage - 1;
                                setCampaignPage(newPage);
                              }
                            }}
                            className="join-item btn"
                          >
                            «
                          </button>
                          <button className="join-item btn">
                            {campaignIsFetching || campaignIsLoading ? (
                              <span className="loading loading-dots loading-md"></span>
                            ) : (
                              `Page ${campaignPage + 1}`
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (CampaignData.data.length >= 10) {
                                const newPage = campaignPage + 1;
                                setCampaignPage(newPage);
                              } else {
                                return;
                              }
                            }}
                            className="join-item btn"
                          >
                            »
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : values.selected == "redeem" ? (
                  <>
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
                        {/* {EmployeeIsFetching || EmployeeIsLoading ? (
                        <tr className="text-center">
                          <td colSpan={6}>Getting employee list.</td>
                        </tr>
                      ) : EmployeeData.data.length == 0 ? (
                        <tr className="text-center">
                          <td colSpan={6}>No employee found.</td>
                        </tr>
                      ) : (
                        EmployeeData.data.map(
                          (employee: any, index: number) => (
                            <tr key={index} className="row">
                              <th>{index + 1}</th>
                              <td>
                                {employee.first_name} {employee.middle_name}{" "}
                                {employee.last_name}{" "}
                                {employee.suffix == "" ||
                                employee.suffix == "N/A" ||
                                employee == null
                                  ? ""
                                  : employee.suffix}
                              </td>
                              <td>{employee.name}</td>
                              <td>{employee.email}</td>
                              <td>{employee.phone_number}</td>
                              <td>
                                <button
                                  // onClick={() => {
                                  //   nav.push(
                                  //     `/superadmin/users/updateemployee/?user_id=${employee.CoreId}`
                                  //   );
                                  // }}
                                  type="button"
                                  className="btn btn-info mr-5"
                                >
                                  <Image
                                    src="/images/update-user.png"
                                    alt="edit"
                                    width={20}
                                    height={20}
                                  />
                                  <span> Edit Account</span>
                                </button>
                                <button
                                  // onClick={() => {
                                  //   removeEmployeeMutation.mutate({
                                  //     employee_id: employee.CoreId,
                                  //     user_id:employee.user_id
                                  //   });
                                  //   console.log({
                                  //     employee_id: employee.CoreId,
                                  //     user_id:employee.user_id
                                  //   })
                                  // }}
                                  className="btn btn-error"
                                >
                                  <Image
                                    src="/icons/deleteicon.svg"
                                    alt="edit"
                                    width={20}
                                    height={20}
                                  />
                                  <span> Remove Account</span>
                                </button>
                              </td>
                            </tr>
                          )
                        )
                      )} */}
                      </tbody>
                    </table>
                    <div className="w-11/12 flex mx-auto">
                      <div className="join mx-auto">
                        <button
                          type="button"
                          // onClick={() => {
                          //   if (employeePage !== 0) {
                          //     const newPage = employeePage - 1;
                          //     setEmployeePage(newPage);
                          //   }
                          // }}
                          className="join-item btn"
                        >
                          «
                        </button>
                        <button className="join-item btn">
                          {/* {EmployeeIsFetching || EmployeeIsLoading ? (
                          <span className="loading loading-dots loading-md"></span>
                        ) : (
                          `Page ${  1}`
                        )} */}
                        </button>
                        <button type="button" className="join-item btn">
                          »
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

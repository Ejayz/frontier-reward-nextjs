"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import SelectInput from "@/components/SelectInput";
import NormalInput from "@/components/NormalInput";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { randomUUID } from "crypto";
import { toast } from "react-toastify";

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
  const showRedeemTransaction = useRef<HTMLDialogElement>(null);
  const [campaignTransactionId, setCampaignTransactionID] = useState<any>();
  const [redeemtransactionId, setRedeemTransactionID] = useState<any>();
  const [showPage, setShowPage] = useState(false);
  const [redeemPage, setRedeemPage] = useState(0);
  const {
    data: RedeemTransactionInfo,
    isLoading: RedeemTransactionInfoIsLoading,
    isFetching: RedeemTransactionInfoIsFetching,
    refetch: RedeemTransactionInfoRefetch,
  } = useQuery({
    queryKey: ["redeemtransactioninfo", redeemtransactionId != null],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(
        `/api/private/getRedeemTransactionInfo?id=${redeemtransactionId}`,
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
  const {
    data: RedeemTransaction,
    isLoading: RedeemTransactionIsLoading,
    isFetching: RedeemTransactionIsFetching,
    refetch: RedeemTransactionRefetch,
  } = useQuery({
    queryKey: [
      "redeemtransaction",
      searchForm.current?.values.keyword,
      redeemPage,
    ],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(
        `http://localhost:3000/api/private/getRedeemTransaction?page=${redeemPage}&keyword=${searchForm.current?.values.keyword}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      return data;
    },
  });

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
        nav.push("/?error=401");
      }
      return data;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 0,
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
  const denyTransactionMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(`/api/private/denyCampaignTransaction`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.code == 401) {
        nav.push("/login");
      }
      return data;
    },
    onSuccess: (data: any) => {
      console.log(data);
      if (data.code == 200) {
        setCampaignTransactionID(null);
        campaignRefetch();
        showConfirmCampaignTransaction.current?.close();
        toast.success(data.message)
      }
    },
  });
  const denyRedeemTransactionMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(`/api/private/denyRedeemTransaction`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.code == 401) {
        nav.push("/login");
      }
      return data;
    },
    onSuccess: (data: any) => {
      console.log(data);
      if (data.code == 200) {
        setRedeemTransactionID(null);
        RedeemTransactionRefetch();
        showRedeemTransaction.current?.close();
        toast.success(data.message)
      } else {
        toast.error(data.message);
      }
    },
    onError: (data: any) => {
      toast.error(data.message);
    },
  });
  const confirmRedeemTransactionMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(`/api/private/confirmRedeemTransaction`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.code == 401) {
        nav.push("/login");
      }
      return data;
    },
    onSuccess: (data: any) => {
      console.log(data);
      if (data.code == 200) {
        setRedeemTransactionID(null);
        RedeemTransactionRefetch();
        showRedeemTransaction.current?.close();
        toast.success(data.message)
      } else {
        toast.error(data.message);
      }
    },
    onError: (data: any) => {
      toast.error(data.message);
    },
  });
  const updateCampaignTransaction = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(`/api/private/confirmCampaignTransaction`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.code == 401) {
        nav.push("/login");
      }
      return data;
    },
    onSuccess: (data: any) => {
      console.log(data);
      if (data.code == 200) {
        setCampaignTransactionID(null);
        campaignRefetch();
        showConfirmCampaignTransaction.current?.close();
        toast.success(data.message)
      }
    },
  });

  if (!showPage) {
    return <Loading></Loading>;
  } else {
    return (
      <div className="w-full h-full pl-10">
        <dialog ref={showRedeemTransaction} id="my_modal_1" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-black absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="flex flex-col w-full">
              <h3 className="font-bold text-xl">Redeem Transaction</h3>
              <span className=" text-gray-500 text-base">
                #
                {RedeemTransactionInfoIsFetching ||
                RedeemTransactionInfoIsLoading ? (
                  <>...</>
                ) : RedeemTransactionInfo != null ? (
                  RedeemTransactionInfo.transaction_no
                ) : (
                  <></>
                )}
              </span>
              <br></br>
              <h2 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-gray-500">
                Redeem Rewards
              </h2>

              <div className="flex flex-col gap-2.5">
                {RedeemTransactionInfoIsFetching ||
                RedeemTransactionInfoIsLoading ? (
                  <>...</>
                ) : RedeemTransactionInfo != null ? (
                  <>
                    {RedeemTransactionInfo.data.map(
                      (action: any, index: number) => (
                        <div
                          className="grid grid-cols-1 gap-2  rounded-md border p-5 cursor-pointer"
                          key={index}
                        >
                          <h3 className="mb-1.5 font-semibold leading-none">
                            {action.redeem_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {action.redeem_description}
                          </p>
                          <ul className="mt-2.5 flex flex-col gap-1.5 text-xs font-medium ">
                            <li className="py-2" key={index}>
                              <Image
                                src="/images/reward.png"
                                width={25}
                                height={25}
                                className="mr-1.5 inline-block"
                                alt="reward"
                              />
                              {action.RewardName}
                            </li>
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
                <button
                  onClick={() => {
                    denyRedeemTransactionMutation.mutate({
                      id: RedeemTransactionInfo.data[0].CoreID,
                      transaction_no:
                        RedeemTransactionInfo.data[0].transaction_no,
                    });
                  }}
                  className={`${
                    RedeemTransactionInfoIsLoading ||
                    RedeemTransactionInfoIsFetching ? (
                      <>...</>
                    ) : RedeemTransactionInfo != null ? (
                      RedeemTransactionInfo.data[0].Status == "pending" ? (
                        "btn-success"
                      ) : (
                        "btn-disabled"
                      )
                    ) : (
                      ""
                    )
                  } btn btn-error rounded-full`}
                >
                  Deny
                </button>
                <button
                  onClick={() => {
                    confirmRedeemTransactionMutation.mutate({
                      id: RedeemTransactionInfo.data[0].CoreID,
                      transaction_no:
                        RedeemTransactionInfo.data[0].transaction_no,
                    });
                  }}
                  className={`${
                    RedeemTransactionInfoIsFetching ||
                    RedeemTransactionInfoIsLoading ? (
                      <>...</>
                    ) : RedeemTransactionInfo != null ? (
                      RedeemTransactionInfo.data[0].Status == "pending" ? (
                        "btn-success"
                      ) : (
                        "btn-disabled"
                      )
                    ) : (
                      ""
                    )
                  } btn  col-span-3 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:border-white hover:bg-neutral-800 hover:text-white`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </dialog>
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

                          <ul className="mt-2.5 flex flex-col gap-1.5 text-xs font-medium ">
                            {action.data.map((reward: any, index: number) => (
                              <li className="py-2" key={index}>
                                <Image
                                  src="/images/reward.png"
                                  width={25}
                                  height={25}
                                  className="mr-1.5 inline-block"
                                  alt="reward"
                                />
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
                <button
                  onClick={() => {
                    denyTransactionMutation.mutate({
                      campaign_transaction_id: campaignTransactionId,
                      transaction_no: CampaignTransactionInfo.transaction_no,
                    });
                  }}
                  className={`${
                    CampaignTransactionInfoIsFetching ||
                    CampaignTransactionInfoIsLoading ? (
                      <>...</>
                    ) : CampaignTransactionInfo != null ? (
                      CampaignTransactionInfo.status == "pending" ? (
                        "btn-success"
                      ) : (
                        "btn-disabled"
                      )
                    ) : (
                      ""
                    )
                  } btn btn-error rounded-full`}
                >
                  Deny
                </button>
                <button
                  onClick={() => {
                    updateCampaignTransaction.mutate({
                      campaign_transaction_id: campaignTransactionId,
                      transaction_no: CampaignTransactionInfo.transaction_no,
                    });
                  }}
                  className={`${
                    CampaignTransactionInfoIsFetching ||
                    CampaignTransactionInfoIsLoading ? (
                      <>...</>
                    ) : CampaignTransactionInfo != null ? (
                      CampaignTransactionInfo.status == "pending" ? (
                        "btn-success"
                      ) : (
                        "btn-disabled"
                      )
                    ) : (
                      ""
                    )
                  } btn  col-span-3 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:border-white hover:bg-neutral-800 hover:text-white`}
                >
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
                        <button
                          onClick={() => {
                            if (values.selected == "campaign") {
                              campaignRefetch();
                            } else if (values.selected == "redeem") {
                              RedeemTransactionRefetch();
                            }
                          }}
                          className="btn join-item"
                        >
                          Search
                        </button>
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
                          <th>Transaction #</th>
                          <th>Redeem Name</th>
                          <th>Customer Name</th>
                          <th>Points</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RedeemTransactionIsFetching ||
                        RedeemTransactionIsLoading ? (
                          <tr className="text-center">
                            <td colSpan={6}>
                              Getting Redeem Transaction List.
                            </td>
                          </tr>
                        ) : RedeemTransaction?.data?.length === 0 ? (
                          <tr className="text-center">
                            <td colSpan={6}>No Redeem Transaction Found.</td>
                          </tr>
                        ) : (
                          RedeemTransaction.data.map(
                            (redeem_transaction: any, index: number) => (
                              <tr key={index} className="row">
                                <th>{redeem_transaction.transaction_no}</th>
                                <td>{redeem_transaction.redeem_name}</td>
                                <td>{redeem_transaction.customer_name}</td>
                                <td>{redeem_transaction.point_cost}</td>
                                <td className="uppercase">
                                  {redeem_transaction.Status}
                                </td>
                                <td>
                                  <button
                                    onClick={async () => {
                                      await setRedeemTransactionID(
                                        redeem_transaction.CoreID
                                      );
                                      await RedeemTransactionInfoRefetch();
                                      showRedeemTransaction.current?.showModal();
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
                            if (redeemPage !== 0) {
                              const newPage = redeemPage - 1;
                              setRedeemPage(newPage);
                            }
                          }}
                          className="join-item btn"
                        >
                          «
                        </button>
                        <button className="join-item btn">
                          {RedeemTransactionIsFetching ||
                          RedeemTransactionIsLoading ? (
                            <span className="loading loading-dots loading-md"></span>
                          ) : (
                            `Page ${1}`
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (RedeemTransaction?.data?.length >= 10) {
                              const newPage = redeemPage + 1;
                              setRedeemPage(newPage);
                            } else {
                              return;
                            }
                          }}
                          type="button"
                          className="join-item btn"
                        >
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

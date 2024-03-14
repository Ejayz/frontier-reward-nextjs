"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import Loading from "../loading";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
export default function Page() {
  const [page, setPage] = useState(0);
  const [dataAction, setDataAction] = useState<number | null>(null);
  const dialogShowData = useRef<HTMLDialogElement>(null);
  const [transaction_no, setTransaction_no] = useState<string>("");
  const showConfirmModal = useRef<HTMLDialogElement>(null);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["campaigns", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(`/api/private/getCampaignList/?page=${page}`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const createCampaignTransactionMutation = useMutation({
    mutationFn: async (campaign_id: number) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(`/api/private/createCampaignTransaction`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ campaign_id }),
      });
      let data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.code == 200) {
        dialogShowData.current?.close();
        setTransaction_no(data.data);
        toast.success("Transaction created successfully");
        showConfirmModal.current?.showModal();
      } else {
        dialogShowData.current?.close();
        toast.error(data.message);
      }
    },

  });

  return (
    <div className={`overflow-auto w-full p-4 h-full `}>
      <dialog ref={showConfirmModal} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Campaign Transaction Created !</h3>
          <p className="py-4">
            Go to our nearest branch and do the actions to claim your rewards.
            Take a screenshot of this transaction number and show it to our
            staff.
          </p>
          <h2 className="text-2xl text-center font-bold">{transaction_no}</h2>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog ref={dialogShowData} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Campaign Actions and Rewards</h3>
          <div className="flex flex-col gap-2.5">
            {isLoading || isFetching ? (
              <>...</>
            ) : dataAction != null ? (
              <>
                {data.data[dataAction].actions.map(
                  (action: any, index: number) => {
                    console.log(action);
                    return (
                      <div
                        className="grid grid-cols-1 gap-2 card shadow-xl w-96  rounded-md border p-5 cursor-pointer"
                        key={index}
                      >
                        <h3 className="mb-1.5 font-semibold leading-none">
                          {action.ActionName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {action.ActionDescription}
                        </p>
                        <ul className="mt-2.5 flex card-body flex-col gap-1.5 text-xs font-medium ">
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
                    );
                  }
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="modal-action">
            <button
              type="button"
              onClick={() => {
                if (dataAction != null) {
                  createCampaignTransactionMutation.mutate(
                    data.data[dataAction].id
                  );
                }
              }}
              className={`btn btn-success`}
            >
              Create Transaction
            </button>
            <button
              type="button"
              onClick={() => {
                dialogShowData.current?.close();
              }}
              className="btn"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <div
        className={`${
          isLoading || isFetching
            ? ""
            : data == undefined
            ? ""
            : data.data.length == 0
            ? "flex flex-col"
            : "grid lg:grid-cols-5 md:grid-rows-5 sm:grid-rows-5  gap-x-2 gap-y-4 overflow-y-scroll"
        } w-full h-screen`}
      >
        {isLoading || isFetching ? (
          <Loading></Loading>
        ) : data.data.length == 0 ? (
          <span className="w-full text-xl font-bold text-center">
            No campaign to show for you.
          </span>
        ) : (
          data.data.map((campaigns: any, indexs: number) => {
            return (
              <div
                key={indexs}
                className="flex flex-col shadow-xl rounded-lg p-4 w-full h-56"
              >
                <div className="flex flex-row ">
                  <h3 className="my-auto font-bold text-xl">
                    {campaigns.name}
                  </h3>
                  <div
                    className={`my-auto mx-2 badge ${
                      campaigns.status == "active"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {campaigns.status.toUpperCase()}
                  </div>
                </div>
                <span className=" text-gray-500 text-base">
                  {campaigns.description}
                </span>
                <br></br>

                <div className="mt-auto mb-0 grid w-full grid-cols-1 gap-2.5">
                  <button
                    onClick={() => {
                      setDataAction(indexs);
                      dialogShowData.current?.showModal();
                    }}
                    className={` ${
                      campaigns.status == "active"
                        ? "btn btn-info"
                        : "btn btn-disabled"
                    } rounded-full`}
                  >
                    Show Campaign Actions and Rewards
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div className="w-full mt-6 flex  mb-36">
          {" "}
          {isLoading || isFetching ? (
            <></>
          ) : data.data.length == 0 ? (
            <></>
          ) : (
            <div className="join mx-auto mt-6">
              <button
                onClick={() => {
                  const newPage = page - 1;
                  if (page != 0) {
                    setPage(newPage);
                  }
                }}
                className="join-item btn"
              >
                «
              </button>
              <button className="join-item btn">Page {page + 1}</button>
              <button
                onClick={() => {
                  const newPage = page + 1;
                  if (data.data.length == 10) {
                    setPage(newPage);
                  }
                }}
                className="join-item btn"
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

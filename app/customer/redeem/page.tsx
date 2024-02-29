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

      let response = await fetch(`/api/private/getRedeemList/?page=${page}`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      return data;
    },
    placeholderData: keepPreviousData,
  });
  const {
    data: CustomerPoints,
    isLoading: CustomerPointsIsLoading,
    isFetching: CustomerPointsIsFetching,
  } = useQuery({
    queryKey: ["CuistomerPoints", page],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(`/api/private/getUserPoints`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      return data;
    },
  });
  const createRedeemTransactions = useMutation({
    mutationFn: async (id: number) => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
      let response = await fetch(`/api/private/createRedeemTransaction`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ redeem_id: id }),
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
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className={`overflow-auto w-full p-4 h-full `}>
      <dialog ref={showConfirmModal} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Redeem Transaction Created !</h3>
          <p className="py-4">
            Go to our nearest branch and show the transaction number to claim
            your rewards. Take a screenshot of this transaction number and show
            it to our staff.
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
                        <p></p>
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
            : data.data.length == 0
            ? "flex flex-col"
            : "grid grid-cols-5 gap-x-2 gap-y-4"
        } w-full h-3/4`}
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
                className="flex flex-col shadow-xl min-h-56 rounded-lg p-4 w-full h-96"
              >
                <div className="flex flex-row ">
                  <h3 className="my-auto font-bold text-xl">
                    {campaigns.RedeemName}
                  </h3>
                  <div
                    className={`my-auto mx-2 badge ${
                      campaigns.status == "available"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {campaigns.status}
                  </div>
                </div>
                <span className=" text-gray-500 text-base">
                  {campaigns.RedeemDescription}
                </span>
                <ul className="mt-2 flex card-body flex-col gap-1.5 text-xs font-medium ">
                  <li className="py-2">
                    <Image
                      src="/images/reward.png"
                      width={25}
                      height={25}
                      className="mr-1.5 inline-block"
                      alt="reward"
                    />
                    {campaigns.RewardName}
                  </li>
                </ul>
                <span className="w-full text-center my-2">
                  {CustomerPointsIsFetching || CustomerPointsIsLoading
                    ? "..."
                    : CustomerPoints.data}{" "}
                  of {campaigns.point_cost} Frontiers
                </span>
                <progress
                  className="progress my-2 progress-primary w-56"
                  value={
                    CustomerPointsIsFetching || CustomerPointsIsLoading
                      ? 0
                      : CustomerPoints.data
                  }
                  max={campaigns.point_cost}
                ></progress>
                <div className="mt-auto mb-0 grid w-full grid-cols-1 gap-2.5">
                  <button
                    onClick={() => {
                      createRedeemTransactions.mutate(campaigns.RedeemID);
                    }}
                    className={` ${
                      CustomerPointsIsFetching || CustomerPointsIsLoading
                        ? "btn btn-disabled"
                        : campaigns.status == "available" &&
                          CustomerPoints.data >= campaigns.point_cost
                        ? "btn btn-info"
                        : "btn btn-disabled"
                    } rounded-full`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="w-full flex ">
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
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProfileCard() {
  const getUserId = useSearchParams();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customer_prodile_card", { user_id: getUserId?.get("user_id") }],
    queryFn: async ({}) => {
      const res = await fetch(
        `/api/private/getCustomerProfileCard?user_id=${getUserId?.get(
          "user_id"
        )}`
      );
      return res.json();
    },
  });

  return (
    <>
      <div className="bg-white p-3 border-t-4 border-green-400">
        <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
          {isLoading || isFetching
            ? "Loading..."
            : `${data?.data[0]?.first_name} ${
                data?.data[0]?.suffix != "" ? data?.data[0]?.suffix : ""
              } ${data?.data[0]?.last_name} ${
                data?.data[0]?.suffix != "" ? data?.data[0]?.suffix : ""
              }`}
        </h1>
        <h3 className="text-gray-600 font-lg text-semibold leading-6">
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.email}
        </h3>
        <h3 className="text-gray-600 font-lg text-semibold leading-6">
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.phone_number}
        </h3>
        <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.address_1}{" "}
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.address_2}{" "}
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.city}{" "}
          {isLoading || isFetching
            ? "Loading..."
            : data?.data[0]?.state_province}{" "}
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.zip_code}{" "}
          {isLoading || isFetching ? "Loading..." : data?.data[0]?.country}
        </p>
        <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
          <li className="flex items-center py-3">
            <span>Status</span>
            <span className="ml-auto">
              <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
                Active
              </span>
            </span>
          </li>
          <li className="flex items-center py-3">
            <span>Member since</span>
            <span className="ml-auto">
              {isLoading || isFetching
                ? "Loading..."
                : DateTime.fromISO(data?.data[0]?.created_at).toLocaleString(
                    DateTime.DATE_MED
                  )}
            </span>
          </li>
          <li className="flex items-center py-3">
            <span>Package</span>
            <span className="ml-auto">
                {isLoading || isFetching ? "Loading..." : data?.data[0]?.name}
            </span>
          </li>
          <li className="flex items-center py-3">
            <span>Points</span>
            <span className="ml-auto">
            {isLoading || isFetching ? "Loading..." : data?.data[0]?.points} Frontiers</span>
          </li>
        </ul>
      </div>
    </>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/dist/client/components/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateTime } from "luxon";
export default function CarInfromationList() {
  const getUserId = useSearchParams();
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["transactions", { page, user_id: getUserId?.get("user_id") }],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(
        `/api/private/getCustomerCar?page=${page}&user_id=${getUserId?.get(
          "user_id"
        )}`
      );
      return res.json();
    },
  });

  return (
    <div className="overflow-x-auto flex flex-col">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Vin Id</th>
            <th>Year</th>
            <th>Trim</th>
            <th>Color</th>
            <th>Model</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {!getUserId?.get("user_id") ? (
            <tr>
              <td className="text-center" colSpan={6}>
                No user selected
              </td>
            </tr>
          ) : isLoading || isFetching ? (
            <tr>
              <td className="text-center" colSpan={6}>
                Loading...
              </td>
            </tr>
          ) : data?.data?.length === 0 ? (
            <tr>
              <td className="text-center" colSpan={6}>
                No campaign Transaction yet.
              </td>
            </tr>
          ) : (
            data?.data?.map((item: any, index: any) => (
              <tr key={index}>
                <td className="font-bold">{index + 1}</td>
                <td>{item.vin_no}</td>
                <td>{item.year}</td>
                <td>{item.trim}</td>
                <td>{item.color}</td>
                <td>{item.model}</td>
                <td>
                  {DateTime.fromISO(item.created_at).toFormat(
                    "EEEE, MMMM d, yyyy"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="join mx-auto">
        <button
          onClick={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }}
          className="join-item btn"
        >
          «
        </button>
        <button className="join-item btn">Page {page + 1}</button>
        <button
          onClick={() => {
            if (data?.data?.length === 10) {
              setPage(page + 1);
            }
          }}
          className="join-item btn"
        >
          »
        </button>
      </div>
    </div>
  );
}

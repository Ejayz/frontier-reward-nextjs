"use client";

import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function NotificationComponentAdmins({ user }: any) {
  const {
    data: NotificationData,
    error: NotificationError,
    isLoading: NotificationIsLoading,
    isError: NotificationIsError,
    isFetching: NotificationIsFetching,
    refetch: NotificationRefetch,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const response = await fetch("/api/private/getAdminNotifications/", {
        method: "GET",
      });
      const data = await response.json();
      return data;
    },
  });
  return (
    <>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {NotificationIsLoading || NotificationIsFetching ? (
              <span className="badge badge-xs badge-primary indicator-item">
                <span className="loading loading-dots loading-xs"></span>
              </span>
            ) : NotificationData == undefined ? (
              0
            ) : NotificationData.data.length == 0 ? null : (
              <span className="badge badge-xs badge-primary indicator-item">
                {NotificationData.data.length}
              </span>
            )}
          </div>
        </button>
      </div>
      <div
        tabIndex={0}
        className="mt-2 z-[1] card card-compact   h-64 dropdown-content w-96 bg-white text-black shadow-2xl shadow-black"
      >
        <div className="card-body h-64 overflow-y-auto">
          {NotificationIsLoading || NotificationIsFetching ? (
            <Link
              href={""}
              className="w-full h-auto px-2 bg-base-200 shadow-xl rounded-md"
            >
              {/* Message container */}
              <div className="w-full">
                <span className="text-base p-2 ">Loading notifications...</span>
              </div>
              {/* Time and date and mins passed by container */}
              <div className="py-2"></div>
            </Link>
          ) : NotificationData == undefined ? (
            <Link
              href={""}
              className="w-full h-auto px-2 bg-base-200 shadow-xl rounded-md"
            >
              {/* Message container */}
              <div className="w-full">
                <span className="text-base p-2 ">
                  Something went wrong while fetching the notifications
                </span>
              </div>
              {/* Time and date and mins passed by container */}
              <div className="py-2"></div>
            </Link>
          ) : NotificationData.data.length == 0 ? (
            <Link
              href={""}
              className="w-full h-auto px-2 bg-base-200 shadow-xl rounded-md"
            >
              {/* Message container */}
              <div className="w-full font-bold text-center">
                <span className="text-base p-2  ">
                  No notifications available.
                </span>
              </div>
            </Link>
          ) : (
            NotificationData.data.map((notification: any, index: number) => (
              <div
                key={index}
                className="w-full h-auto px-2 bg-base-200 shadow-xl flex-row flex rounded-md"
              >
                <Link
                  href={`/${user}/transactions`}
                  onClick={async () => {
                    const response = await fetch(
                      "/api/private/markNotificationRead",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          notification_id: notification.id,
                        }),
                      }
                    );
                    const data = await response.json();
                    if (data.code == 200) {
                      NotificationRefetch();
                    } else {
                      toast.error(data.message);
                    }
                  }}
                >
                  <div className="w-full">
                    <span className="text-base p-2 ">
                      {notification.notification_details}
                    </span>
                  </div>
                  {/* Time and date and mins passed by container */}
                  <div className="py-2">
                    <span className="text-sm font-bold font-mono">
                      {DateTime.fromISO(notification.created_at).toFormat(
                        "EEEE, MMMM d, yyyy"
                      )}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={async () => {
                    const response = await fetch(
                      "/api/private/markNotificationRead",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          notification_id: notification.id,
                        }),
                      }
                    );
                    const data = await response.json();
                    if (data.code == 200) {
                      toast.success(data.message);
                      NotificationRefetch();
                    } else {
                      toast.error(data.message);
                    }
                  }}
                  className="link  underline"
                >
                  <Image
                    src="/images/checked.png"
                    width={40}
                    height={40}
                    alt="View"
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

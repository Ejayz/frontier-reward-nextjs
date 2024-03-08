"use client";
import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useToast } from "@/hooks/useToast";
export default function SalesPersonDashboardNav({
  child,
}: Readonly<{
  child: React.ReactNode;
}>) {
  
  const { showToast } = useToast();
  const [data, setData] = useState<any>();
  const navbarActive = usePathname();
  const logoutMutate = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/private/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.code == 200) {
        toast.success(data.message);
        open("/", "_self");
      } else {
        toast.error(data.message);
      }
    },
  });
  

  const {
    data: DataNotifRecordPagination,
    isFetching: isFetchingNotifRecordPagination,
    isLoading: isLoadingNotifRecordPagination,
    refetch: RefetchNotifRecordPagination,
  } = useQuery({
    queryKey: ["getNotificationRecordPagination"],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getNotificationRecord`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (!response.ok) {
        showToast({
          status: "error",
          message: data.message,
        });
      }
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });
  const {
    data: DataNotifPagination,
    isFetching: isFetchingNotifPagination,
    isLoading: isLoadingNotifPagination,
    refetch: RefetchNotifPagination,
  } = useQuery({
    queryKey: ["getNotificationPagination"],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };
      let response = await fetch(`/api/private/getNotification`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      if (!response.ok) {
        showToast({
          status: "error",
          message: data.message,
        });
      }
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });
  // Function to make the ThunderClient request
  const makeThunderClientRequest = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/loginrole", {
        method: "get",
        headers: headersList,
      });

      let data = await response.json();
      console.log("Response data:", data);
      setData(data);
    } catch (error) {
      console.error("Error making ThunderClient request:", error);
    }
  };

  // Use the useEffect hook to trigger the ThunderClient request when the page loads
  useEffect(() => {
    makeThunderClientRequest();
  }, []); // The empty dependency array ensures the effect runs only once, when the component mounts

  let notification_id = 0;
  const createActionMutation = useMutation({
    mutationFn: async (values: any) => {
      try {
        let headersList = {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
        };

        let response = await fetch(`/api/private/createNotification/`, {
          method: "POST",
          body: values,
          headers: headersList,
        });
        RefetchNotifPagination();
        return response.json();
      } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
      }
    },  
    onSuccess: async (data: any) => {
      // ... (other success logic)
    },
    onError: async (error: any) => {
      // ... (other error handling logic)
    },
  });

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-white">
          <div className="flex-1  mx-2">
            <a className="btn scale-75 lg:scale-100  btn-ghost ">
              <Image
                src="/images/logo-nav.png"
                height={48}
                width={215}
                className=""
                alt=""
              />
            </a>
          </div>
          <div className="flex-none ">
            <div className="dropdown hidden lg:block dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
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
                    <span className="badge badge-xs badge-primary indicator-item">
                      15
                    </span>
                  </div>
                </button>
              </div>
              <div
                tabIndex={0}
                className="mt-2 z-[1] card card-compact h-auto dropdown-content w-96 bg-white text-black shadow-md shadow-black"
              >
<div className="card-body h-64 overflow-y-auto">
  {isFetchingNotifPagination ? (
    <div>Loading...</div>
  ) : (
    <>
      {DataNotifPagination?.data?.map((element: any) => {
        const NotifCreatedAt = element.created_at;
        const created_date = new Date(NotifCreatedAt);
        const notifrecordID = DataNotifRecordPagination?.data?.find(
          (item: any) => item.notification_id === element.id
        );
        const handleClick = () => {
          // Function to handle click and print element.id
          console.log(`Clicked on element with id: ${element.id}`);
          notification_id = element.id;
          const values = JSON.stringify({
            notification_id: notification_id,
          });
          createActionMutation.mutate(values);
          useEffect(() => {
            RefetchNotifPagination();
          },);
        };

        // Check if notifrecordID is undefined to determine whether element.id exists in DataNotifRecordPagination.data
        const isNewNotification = notifrecordID === undefined;

        return (

          <Link
            key={element.id}
            href={""}
            className={`w-full h-auto px-2 bg-base-200 rounded-md block shadow-md shadow-black ${isNewNotification ? "relative" : ""}`} 
            onClick={handleClick}
          >
            {isNewNotification && (
              <div className="badge badge-primary badge-sm absolute top-0 right-0">
                New!
              </div>
            )}
            <span className="text-base py-2">
              {element.redeem_id !== null
                ? "New Redeem was added. Check it out!"
                : element.campaign_id !== null
                ? "New Campaign was added. Check it out!"
                : null}
            </span>
            <div className="py-2 flex">
              <span className="text-sm font-bold font-mono">
                {created_date.toDateString()}
              </span>
              <span className="ml-4 text-sm font-bold font-mono">
                {created_date.toLocaleTimeString()}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  )}
</div>

               
              </div>
            </div>
            <div className="dropdown hidden lg:block dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    alt="Tailwind CSS Navbar component"
                    src="/images/user-profile.png"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              > <li className="text-center font-bold">
              Logged in as {data ? data.data.role_name : ""}
            </li>
                <li>
                  <button
                    onClick={() => {
                      logoutMutate.mutate();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
        </div>
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content  flex flex-col items-center justify-center">
            {/* Page content here */}
            {child}
          </div>
          <div className="drawer-side ">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-white text-base-content">
              {/* Sidebar content here */}

              <li
                className={`${
                  navbarActive?.includes("/customer/campaigns")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/customer/campaigns"}
                  className="text-2xl font-bold"
                >
                  <Image
                    src="/icons/campaigns.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Campaigns
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/customer/redeem")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/customer/redeem"} className="text-2xl font-bold">
                  <Image
                    src="/icons/redeem-points.png"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />{" "}
                  Redeem
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/customer/profile")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/customer/profile"} className="text-2xl font-bold">
                  <Image
                    src="/images/user-profile.png"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Profile
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/customer/settings")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  className="text-2xl font-bold"
                  href={"/customer/settings"}
                >
                  <Image
                    src="/icons/settings.png"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          <li
            className={`${
              navbarActive?.includes("/customer/dashboard")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/customer/dashboard"} className="text-2xl font-bold">
              <Image
                src="/icons/dashboard.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Dashboard
            </Link>
          </li>

          <li
            className={`${
              navbarActive?.includes("/customer/campaigns")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/customer/campaigns"} className="text-2xl font-bold">
              <Image
                src="/icons/campaigns.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Campaigns
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/customer/redeem")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/customer/redeem"} className="text-2xl font-bold">
              <Image
                src="/icons/redeem-points.png"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />{" "}
              Redeem
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/customer/profile")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/customer/profile"}>
              <Image
                src="/icons/settings.png"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Profile
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/customer/profile")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/customer/settings"}>
              <Image
                src="/icons/settings.png"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Settings
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                logoutMutate.mutate();
              }}
              className="text-2xl font-bold"
            >
              <Image
                src="/images/logout.png"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

"use client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function SalesPersonDashboardNav({
  child,
}: Readonly<{
  child: React.ReactNode;
}>) {
  
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
  const [data, setData] = useState<any>();
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
      setData(data);
    } catch (error) {
      console.error("Error making ThunderClient request:", error);
    }
  };

  // Use the useEffect hook to trigger the ThunderClient request when the page loads
  useEffect(() => {
    makeThunderClientRequest();
  }, []); // The empty dependency array ensures the effect runs only once, when the component mounts

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
                className="mt-2 z-[1] card card-compact   h-64 dropdown-content w-96 bg-white text-black shadow-2xl shadow-black"
              >
                <div className="card-body h-64 overflow-y-auto">
                  <Link
                    href={""}
                    className="w-full h-auto px-2 bg-base-200 shadow-xl rounded-md"
                  >
                    {/* Message container */}
                    <div className="w-full">
                      <span className="text-base p-2 ">
                        Sample Campaign was added . Check it out !
                      </span>
                    </div>
                    {/* Time and date and mins passed by container */}
                    <div className="py-2">
                      <span className="text-sm font-bold font-mono">
                        Aug 12, 2023 12:15PM
                      </span>
                      |
                      <span className="text-sm font-bold font-mono">
                        10m ago
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="card-actions">
                  <button className="btn p-4 btn-primary btn-block">
                    View Notifications
                  </button>
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
              >
                <li className="text-center font-bold ">
                  Logged in as {data == undefined ? "" : data.data.name}{" "}
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
                  navbarActive?.includes("/salesperson/dashboard")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/dashboard"}
                  className="text-2xl font-bold"
                >
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
                  navbarActive?.includes("/salesperson/customer")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/customer"}
                  className="text-2xl font-bold"
                >
                  <Image
                    src="/images/customer-service.png"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Customer
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/salesperson/transactions")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/transactions"}
                  className="text-2xl font-bold"
                >
                  <Image
                    src="/icons/transactions.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />{" "}
                  Transactions
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/salesperson/packages")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/packages"}
                  className="text-2xl font-bold"
                >
                  <Image
                    src="/icons/packages.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Packages
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/salesperson/campaigns")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/campaigns"}
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
                  navbarActive?.includes("/salesperson/actions")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/actions"}
                  className="text-2xl font-bold"
                >
                  <Image
                    src="/icons/actions.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />{" "}
                  Actions
                </Link>
              </li>

              <li
                className={`${
                  navbarActive?.includes("/salesperson/rewards")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/rewards"}
                  className="text-2xl font-bold"
                >
                  <Image
                    src="/icons/rewards.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Rewards
                </Link>
              </li>

              <li
                className={`${
                  navbarActive?.includes("/salesperson/redeem")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/salesperson/redeem"}
                  className="text-2xl font-bold"
                >
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
                  navbarActive?.includes("/salesperson/users")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  className="text-2xl font-bold"
                  href={"/salesperson/users"}
                >
                  <Image
                    src="/icons/users.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Users
                </Link>
              </li>
              <li
                className={`${
                  navbarActive?.includes("/salesperson/settings")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  className="text-2xl font-bold"
                  href={"/salesperson/settings"}
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
              navbarActive?.includes("/salesperson/dashboard")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link
              href={"/salesperson/dashboard"}
              className="text-2xl font-bold"
            >
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
              navbarActive?.includes("/salesperson/customer")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/salesperson/customer"} className="text-2xl font-bold">
              <Image
                src="/images/customer-service.png"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Customer
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/actions")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/salesperson/actions"} className="text-2xl font-bold">
              <Image
                src="/icons/actions.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />{" "}
              Actions
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/packages")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/salesperson/packages"} className="text-2xl font-bold">
              <Image
                src="/icons/packages.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Packages
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/rewards")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/salesperson/rewards"} className="text-2xl font-bold">
              <Image
                src="/icons/rewards.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Rewards
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/campaigns")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link
              href={"/salesperson/campaigns"}
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
              navbarActive?.includes("/salesperson/redeem")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/salesperson/redeem"} className="text-2xl font-bold">
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
              navbarActive?.includes("/salesperson/transactions")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link
              href={"/salesperson/transactions"}
              className="text-2xl font-bold"
            >
              <Image
                src="/icons/transactions.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />{" "}
              Transactions
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/users")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/salesperson/users"}>
              <Image
                src="/icons/users.svg"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Users
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/users")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/salesperson/users"}>
              <Image
                src="/images/notification.png"
                className="mr-2"
                alt=""
                width={30}
                height={30}
              />
              Notifications
            </Link>
          </li>
          <li
            className={`${
              navbarActive?.includes("/salesperson/settings")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/salesperson/settings"}>
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
          <li className="text-center mb-0 font-bold ">
                  Logged in as {data == undefined ? "" : data.data.name}{" "}
                </li>
        </ul>
      </div>
    </div>
  );
}

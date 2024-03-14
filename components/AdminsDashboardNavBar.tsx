"use client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NotificationComponentAdmins from "./NotificationComponentAdmins";

export default function AdminsDashboardNavBar({
  child,
}: Readonly<{
  child: React.ReactNode;
}>) {
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
              <NotificationComponentAdmins user={"admin"} />
            </div>
            <div className="dropdown hidden lg:block dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="/images/user-profile.png"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="text-center font-bold ">
                  Logged in as {data == undefined ? "" : data.data.name}
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
          <div className="drawer-content flex flex-col items-center justify-center">
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
                  navbarActive?.includes("/admin/dashboard")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/dashboard"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/customer")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/customer"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/actions")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/actions"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/packages")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/packages"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/rewards")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/rewards"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/campaigns")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/campaigns"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/redeem")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link href={"/admin/redeem"} className="text-2xl font-bold">
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
                  navbarActive?.includes("/admin/transactions")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link
                  href={"/admin/transactions"}
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
                  navbarActive?.includes("/admin/users")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link className="text-2xl font-bold" href={"/admin/users"}>
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
                  navbarActive?.includes("/admin/settings")
                    ? "bg-yellow-400 rounded-md"
                    : ""
                }`}
              >
                <Link className="text-2xl font-bold" href={"/admin/settings"}>
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
              navbarActive?.includes("/admin/dashboard")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/dashboard"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/customer")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/customer"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/actions")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/actions"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/packages")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/packages"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/rewards")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/rewards"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/campaigns")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/campaigns"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/redeem")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/redeem"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/transactions")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link href={"/admin/transactions"} className="text-2xl font-bold">
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
              navbarActive?.includes("/admin/users")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/admin/users"}>
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
              navbarActive?.includes("/admin/users")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/admin/users"}>
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
              navbarActive?.includes("/admin/settings")
                ? "bg-yellow-400 rounded-md"
                : ""
            }`}
          >
            <Link className="text-2xl font-bold" href={"/admin/settings"}>
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

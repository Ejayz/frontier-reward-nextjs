"use client"
import Image from "next/image"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default async function DashboardNavBar({
  child,
}: Readonly<{
  child: React.ReactNode;
}>) {
    const navbarActive = usePathname();
    console.log(navbarActive);
  return (
    <div className="drawer" data-theme={"light"}>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          <div className="flex-1 px-2 mx-2">
            <a className="btn btn-ghost text-xl">
              <Image
                src="/png/logo-nav.png"
                height={48}
                width={215}
                alt=""
              />
            </a>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
              >
                <div className="card-body">
                  <span className="font-bold text-lg">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">
                      View cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="/png/user-profile.png"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
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
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              {/* Sidebar content here */}
              <li
          className={`${
            navbarActive?.includes("/superadmin/dashboard")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link href={"/superadmin/dashboard"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/actions") ? "bg-yellow-400" : ""
          }`}
        >
          <Link href={"/superadmin/actions"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/packages")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link href={"/superadmin/packages"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/rewards") ? "bg-yellow-400" : ""
          }`}
        >
          <Link href={"/superadmin/rewards"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/campaigns")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link href={"/superadmin/campaigns"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/redeem")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link
            href={"/superadmin/redeem"}
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
            navbarActive?.includes("/superadmin/transactions")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link
            href={"/superadmin/transactions"}
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
            navbarActive?.includes("/superadmin/users") ? "bg-yellow-400" : ""
          }`}
        >
          <Link className="text-2xl font-bold" href={"/superadmin/users"}>
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
            navbarActive?.includes("/superadmin/dashboard")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link href={"/superadmin/dashboard"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/actions") ? "bg-yellow-400" : ""
          }`}
        >
          <Link href={"/superadmin/actions"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/packages")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link href={"/superadmin/packages"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/rewards") ? "bg-yellow-400" : ""
          }`}
        >
          <Link href={"/superadmin/rewards"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/campaigns")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link href={"/superadmin/campaigns"} className="text-2xl font-bold">
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
            navbarActive?.includes("/superadmin/redeem")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link
            href={"/superadmin/redeem"}
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
            navbarActive?.includes("/superadmin/transactions")
              ? "bg-yellow-400"
              : ""
          }`}
        >
          <Link
            href={"/superadmin/transactions"}
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
            navbarActive?.includes("/superadmin/users") ? "bg-yellow-400" : ""
          }`}
        >
          <Link className="text-2xl font-bold" href={"/superadmin/users"}>
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
        </ul>
      </div>
    </div>
  );
}

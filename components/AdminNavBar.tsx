"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function AdminNavBar() {
  const navbarActive=usePathname();
  console.log(navbarActive);
  return (
    <div className="navbar bg-white  " data-theme="light">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <Image src="/images/logo-nav.png" height={48} width={215} alt="" />
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
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
                <span className="badge badge-xs badge-primary indicator-item">
                  15
                </span>
              </div>
            </button>
          </div>
          <div
            tabIndex={0}
            className="mt-2 z-[1] card card-compact   h-64 dropdown-content w-96 bg-base-100 shadow-2xl shadow-black"
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
                  |<span className="text-sm font-bold font-mono">10m ago</span>
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
        <button className="font-bold px-4 uppercase hover:text-yellow-500">
          Logout
        </button>
      </div>
    </div>
  );
}

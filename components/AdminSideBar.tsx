"use client";
import Link from "next/link";

export default function AdminSideBar() {
  return (
    <div className="w-1/4 h-screen bg-white">
      <ul className="menu w-80 h-screen [&_li>*]:rounded-none fixed bg-white text-slate-950">
        <li className="bg-yellow-400">
          <Link href={"dashboard"} className="text-2xl font-bold">
            <img
              src="./icons/dashboard.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />
            Dashboard
          </Link>
        </li>
        <li>
          <a className="text-2xl font-bold">
            <img
              src="./icons/actions.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />{" "}
            Actions
          </a>
        </li>
        <li>
          <a className="text-2xl font-bold">
            <img
              src="./icons/packages.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />
            Packages
          </a>
        </li>
        <li>
          <a className="text-2xl font-bold">
            <img
              src="./icons/rewards.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />
            Rewards
          </a>
        </li>
        <li>
          <a className="text-2xl font-bold">
            <img
              src="./icons/campaigns.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />
            Campaigns
          </a>
        </li>
        <li>
          <Link className="text-2xl font-bold" href={"/users"}>
            <img
              src="./icons/users.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />
            Users
          </Link>
        </li>
        <li>
          <a className="text-2xl font-bold">
            <img
              src="./icons/transactions.svg"
              className="mr-2"
              alt=""
              width={30}
              height={30}
            />{" "}
            Transactions
          </a>
        </li>
      </ul>
    </div>
  );
}

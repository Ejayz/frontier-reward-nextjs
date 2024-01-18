"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function AdminSideBar() {
  const navbarActive = usePathname();
  console.log(navbarActive);
  return (
    <div className="w-1/4 h-screen bg-white">
      <ul className="menu w-80 h-screen [&_li>*]:rounded-none fixed bg-white text-slate-950">
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
      </ul>
    </div>
  );
}

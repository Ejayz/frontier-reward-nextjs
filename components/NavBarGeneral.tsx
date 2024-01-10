"use client";
import Link from "next/link";
import Image from "next/image";
export default function NavBarGeneral() {
  return (
    <div className="navbar bg-white  " data-theme="light">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <Image src="/images/logo-nav.png" alt={""} height={48} width={215} />
        </a>
      </div>
    </div>
  );
}

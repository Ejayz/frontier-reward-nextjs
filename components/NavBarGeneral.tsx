import Link from "next/link";

export default function NavBarGeneral() {
  return (
    <div className="navbar bg-white  " data-theme="light">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <img src="../images/logo-nav.png"></img>
        </a>
      </div>
    </div>
  );
}

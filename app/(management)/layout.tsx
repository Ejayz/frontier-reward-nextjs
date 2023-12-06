"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import cookie_processor from "@/hooks/useCookieProcessor";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();
  const [pageState, setPageState] = useState(false);
  useEffect(() => {
    async function init() {
      let data = await cookie_processor(window.document.cookie);
      if (data == null) {
        route.push("/?error=401");
      }else{
        setPageState(true)
      }
    }
    init();
  }, []);
  if (pageState) {
    return (
      <html lang="en">
        <body>
          <main className="min-h-screen">
            {/* navbar */}
            <div className="navbar bg-white">
              <div className="flex-1">
                <a className="btn btn-ghost text-xl">
                  <img src="../images/logo-nav.png"></img>
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
                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
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
            </div>
            {/* sidebar */}
            <ul className="menu w-80 h-screen p-0 [&_li>*]:rounded-none fixed bg-white text-slate-950">
              <li className="bg-yellow-400">
                <a className="text-2xl font-bold">
                  <img
                    src="./icons/dashboard.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Dashboard
                </a>
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
                <a className="text-2xl font-bold">
                  <img
                    src="./icons/users.svg"
                    className="mr-2"
                    alt=""
                    width={30}
                    height={30}
                  />
                  Users
                </a>
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
            <div>{children}</div>
          </main>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en">
        <body>
          <main className="min-h-screen bg-white">
            <div className="flex flex-col">
              <Image
                alt="Animated Gif Electric Car"
                src="/images/electric_car.gif"
                width={500}
                height={500}
                className="mx-auto"
              />
              <span className="mx-auto text-black uppercase font-bold">
                {" "}
                PLEASE WAIT WHILE WE FETCH SOME DATA FOR YOU
              </span>
            </div>
          </main>
        </body>
      </html>
    );
  }
}

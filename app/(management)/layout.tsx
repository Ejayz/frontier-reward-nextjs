"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import cookie_processor from "@/hooks/useCookieProcessor";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminSideBar from "@/components/AdminSideBar";
import AdminNavBar from "@/components/AdminNavBar";
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
      } else {
        setPageState(true);
      }
    }
    init();
  }, []);
  if (pageState) {
    return (
      <html lang="en" data-theme="light">
        <body className="overflow-hidden bg-white">
          <main className="min-h-screen">
            <div>
              <AdminNavBar></AdminNavBar>
            </div>
            <div className="w-full flex flex-row">
              <AdminSideBar></AdminSideBar>
              <div className="w-3/4 h-screen overflow-y-scroll">{children}</div>
            </div>
          </main>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="en" data-theme="light">
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

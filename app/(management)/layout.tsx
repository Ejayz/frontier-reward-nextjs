"use client";
import { useEffect, useRef, useState } from "react";
import "../globals.css";
import cookie_processor from "@/hooks/useCookieProcessor";
import { useRouter } from "next/navigation";
import "react";
import AdminSideBar from "@/components/AdminSideBar";
import AdminNavBar from "@/components/AdminNavBar";
import Loading from "./loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-international-phone/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { pages } from "next/dist/build/templates/app-page";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();

  const [pageState, setPageState] = useState(false);
  const [inits, setInit] = useState(false);
  const [cookiesDetails, setCookieDetails] = useState<{
    exp: number;
    iat: number;
    id: number;
    is_email_verified: boolean;
    is_employee: boolean;
    main_id: number;
    role: number;
    role_name: string;
  }>();
  useEffect(() => {
    async function init() {
      if (document.readyState === "complete") {
        setInit(true);
      }
      let data = await cookie_processor(window.document.cookie);
      if (data == null) {
        route.push("/?error=401");
      } else {
        const request = window.indexedDB.open("point_and_perks", 1);
        setPageState(true);
      }
    }
    init();
  }, []);

  const [resendEmail, setResendEmail] = useState(false);

  return (
    <html lang="en" data-theme="light">
      <body className="overflow-hidden bg-white">
        {" "}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {pageState && inits ? (
          <main className="min-h-screen">
            <div>
              <AdminNavBar></AdminNavBar>
            </div>
            <div className="w-full flex flex-row">
              <AdminSideBar></AdminSideBar>
              <div className="w-3/4 h-screen overflow-y-scroll">
                <QueryClientProvider client={queryClient}>
                  {children}
                </QueryClientProvider>
              </div>
            </div>
          </main>
        ) : (
          <Loading></Loading>
        )}
        <ToastContainer />
      </body>
    </html>
  );
}

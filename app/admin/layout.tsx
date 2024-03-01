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
import AdminDashboardNavBar from "@/components/AdminDashboardNavBar";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();

  const [pageState, setPageState] = useState(false);
  const [inits, setInit] = useState(true);
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
      let data = await cookie_processor(window?.document?.cookie);
      if (data == null) {
        route.push("/?error=401");
      } else {
        setPageState(true);
      }
    }
    init();
  }, []);

  return (
    <html lang="en" data-theme="light">
      <title>Point and Perks</title>
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
          <QueryClientProvider client={queryClient}>
            <main className="min-h-screen">
              <AdminDashboardNavBar child={children}></AdminDashboardNavBar>
            </main>
          </QueryClientProvider>
        ) : (
          <Loading></Loading>
        )}
        <ToastContainer />
      </body>
    </html>
  );
}

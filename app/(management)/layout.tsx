"use client";
import { useEffect, useState } from "react";
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

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route = useRouter();

  const [pageState, setPageState] = useState(false);
  const [init, setInit] = useState(false);
  useEffect(() => {
    async function init() {
      if (document.readyState === "complete") {
        setInit(true);
      }
      let data = await cookie_processor(window.document.cookie);
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
        {pageState && init ? (
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

"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [init, setInit] = useState(false);
  const queryClient = new QueryClient();
  useEffect(() => {
    async function init() {
      if (document.readyState === "complete") {
        setInit(true);
      }
    }
    init();
  }, []);

  return (
    <html lang="en" data-theme="light">
      <body>
        <div>
          <QueryClientProvider client={queryClient}>
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
            {init ? children : <Loading></Loading>}
            <ToastContainer />
          </QueryClientProvider>
        </div>
      </body>
    </html>
  );
}

"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [init, setInit] = useState(false);
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
        </div>
      </body>
    </html>
  );
}

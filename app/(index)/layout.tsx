"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cookie_processor from "@/hooks/useCookieProcessor";
import { usePathname, useRouter } from "next/navigation";
import { JwtPayload } from "jsonwebtoken";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [init, setInit] = useState(false);
  const queryClient = new QueryClient();
  let path = usePathname() || "/";
  const nav = useRouter();
  let data: string | JwtPayload | null = "";
  useEffect(() => {
    async function init() {
      if (document.readyState === "complete") {
        setInit(true);
      }
      data = await cookie_processor(window.document.cookie);
      console.log(path);
      if (typeof data == "string") {
      } else {
        console.log(data);
        if (path == "/newaccountpasswordsetup" && data != null) {
          if (
            data.password_change_at == null ||
            data.password_change_at == true ||
            data.password_change_at == undefined
          ) {
            toast.error(
              "It seems you have already changed your password. Please login with your new password."
            );
            nav.push("/");
          }
        }
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

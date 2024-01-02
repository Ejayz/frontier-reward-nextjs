"use client";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import NavBarGeneral from "@/components/NavBarGeneral";
export default function Page() {
  const param = useSearchParams();

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      const response = await fetch("/api/private/sendConfirmationEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="login-page">
      <NavBarGeneral />
      <span className="top-shape"></span>
      <span className="bottom-shape"></span>
      <div className="hero min-h-screen">
        <div className="card w-1/2 z-50 bg-base-100 shadow-2xl text-black ">
          <div className="card-body">
            {isLoading || isFetching ? (
              <>
                <h2 className="card-title">Sending Email ...</h2>
                <p>
                  Please wait while we send the confirmation email. The
                  confirmation email will be valid for 15 minutes. You can
                  request another email by logging in again after this period.
                </p>
              </>
            ) : (
              <>
                <h2 className="card-title">Confirmation Email Sent !</h2>
                <p>
                  A confirmation email has been sent. Please check the email
                  address associated with your account. If you can't find it,
                  please check your spam folder. You may now close this tab.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

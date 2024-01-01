"use client";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import NavBarGeneral from "@/components/NavBarGeneral";
export default function Page() {
  const param = useSearchParams() as URLSearchParams;
  const token = param.get("token");
  console.log(token);
  const { data, error, isLoading } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      const response = await fetch("/api/private/", {
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
            <h2 className="card-title">Confirm Email!</h2>
            <p>
              For you to use <b>Point and Perks</b> to their full potential, you
              need to confirm your email. Please check the email address sent to
              your account. If you can't find it, check the spam folder. You may
              close this tab now.
            </p>
          </div>
          <button
            onClick={() => {
              window.close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

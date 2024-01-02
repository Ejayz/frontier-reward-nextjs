"use client";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import NavBarGeneral from "@/components/NavBarGeneral";
import Link from "next/link";
import { useEffect } from "react";
export default function Page() {
  const param = useSearchParams() as URLSearchParams;
  const token = param.get("token");
  const {
    data: confirmingEmail,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["login", token],
    queryFn: async () => {
      console.log(token);
      const body = JSON.stringify({ token: token });
      console.log(body);
      const response = await fetch("/api/private/confirmingEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (isFetching || isLoading) {
    } else {
      if (confirmingEmail.code == 200) {
        open("/newaccountpasswordsetup", "_blank");
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    }
  }, [confirmingEmail]);
  return (
    <div className="login-page">
      <NavBarGeneral />
      <span className="top-shape"></span>
      <span className="bottom-shape"></span>
      <div className="hero min-h-screen">
        {isLoading || isFetching ? (
          <>
            <div role="alert" className="alert w-1/2 shadow-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Please wait while we confirm your email. This might take several
                minutes.
              </span>
            </div>
          </>
        ) : confirmingEmail.code == 401 ? (
          <div role="alert" className="alert z-50 alert-error w-1/2 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              It seems that confimation email is expired. You can try again by{" "}
              <Link
                onClick={() => {
                  window.close();
                }}
                className="underline text-blue-400"
                href="/"
                target="_blank"
              >
                logging in
              </Link>
              . Make sure you opened the link before 15 minutes.
            </span>
          </div>
        ) : confirmingEmail.code == 500 ? (
          <div role="alert" className="alert z-50 alert-error w-1/2 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Something went wrong while confirming your email. You can try
              again by{" "}
              <Link className="underline text-blue-400" href={"/"}>
                logging in
              </Link>{" "}
              . Make sure you opened the link before 15 minutes.
            </span>
          </div>
        ) : confirmingEmail.code == 405 ? (
          <div role="alert" className="alert z-50 alert-error w-1/2 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Something went wrong while confirming your email. You can try
              again by{" "}
              <Link className="underline text-blue-400" href={"/"}>
                logging in
              </Link>{" "}
              . Make sure you opened the link before 15 minutes.
            </span>
          </div>
        ) : confirmingEmail.code == 500 ? (
          <div role="alert" className="alert z-50 alert-error w-1/2 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Something went wrong while confirming your email. You can try
              again by{" "}
              <Link className="underline text-blue-400" href={"/"}>
                logging in
              </Link>{" "}
              . Make sure you opened the link before 15 minutes.
            </span>
          </div>
        ) : confirmingEmail.code == 200 ? (
          <div
            role="alert"
            className="alert w-1/2 shadow-lg  z-50 alert-success"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Email confirmed successfully . </span>
          </div>
        ) : (
          <div role="alert" className="alert z-50 alert-error w-1/2 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Something went wrong while confirming your email. You can try
              again by{" "}
              <Link className="underline text-blue-400" href={"/"}>
                logging in
              </Link>{" "}
              . Make sure you opened the link before 15 minutes.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
export default function Page() {
  const [carousel, setCarousel] = useState(1);
  const [RedeemTransactions, setRedeemTransactions] = useState({
    options: {
      title: {
        text: "Redeem Transactions",
      },
      noData: {
        text: "No data",
      },
      labels: ["Pending", "Denied", "Confirmed"],
      colors: ["#d8334a", "#ffd11f", "#f9a72b", "#ffeea3"],
    },
    series: [0, 0, 0],
  });
  const [CampaignTransactions, setCampaignTransactions] = useState({
    options: {
      title: {
        text: "Campaign Transactions",
      },
      noData: {
        text: "No data",
      },
      labels: ["Rejected", "Pending", "Confirmed"],
      colors: ["#d8334a", "#ffd11f", "#f9a72b", "#ffeea3"],
    },
    series: [0, 0, 0],
  });

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["getDashboardData"],
    queryFn: async () => {
      const res = await fetch("/api/private/dashboard");
      const data = await res.json();
      setRedeemTransactions({
        ...RedeemTransactions,
        series: data.redeem,
      });
      setCampaignTransactions({
        ...CampaignTransactions,
        series: data.campaign,
      });
      
      error && console.error(error);
      return data;
    },
  });
  return (
    <div className=" overflow-x-auto lg:overflow-hidden w-full h-screen bg-white">
      <div className="carousel w-full mt-2 mx-auto">
        {carousel == 1 ? (
          <div id="slide1" className="carousel-item relative w-full">
            <Image
              src="/images/slider-1.png"
              className="w-full"
              width={1051}
              height={249}
              alt=""
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5  top-1/2">
              <button
                onClick={() => {
                  if (carousel == 1) {
                    setCarousel(2);
                  } else {
                    setCarousel(1);
                  }
                }}
                className="btn btn-circle"
              >
                ❮
              </button>
              <button
                onClick={() => {
                  if (carousel == 1) {
                    setCarousel(2);
                  } else {
                    setCarousel(1);
                  }
                }}
                className="btn btn-circle"
              >
                ❯
              </button>
            </div>
          </div>
        ) : (
          <div id="slide2" className="carousel-item relative w-full">
            <Image
              src="/images/slider-2.png"
              className="w-full"
              width={1051}
              height={249}
              alt=""
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                onClick={() => {
                  if (carousel == 1) {
                    setCarousel(2);
                  } else {
                    setCarousel(1);
                  }
                }}
                className="btn btn-circle"
              >
                ❮
              </button>
              <button
                onClick={() => {
                  if (carousel == 1) {
                    setCarousel(2);
                  } else {
                    setCarousel(1);
                  }
                }}
                className="btn btn-circle"
              >
                ❯
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full h-full px-5 mt-5 gap-4 inline-block lg:mt-5 lg:flex">
      <div className="inline place-content-center lg:place-content-start lg:flex lg:mt-10">
          <Chart
            options={RedeemTransactions.options}
            series={isLoading || isFetching ? [0, 0, 0] : data?.data?.redeem}
            type="pie"
            width={400}
            height={400}
            className="shadow-ml" 
          />
          <Chart
            options={CampaignTransactions.options}
            series={isLoading || isFetching ? [0, 0, 0] : data?.data?.campaign}
            type="pie"
            width={400}
            height={400}
            className="shadow-ml "
          />
        </div>
      <div className="w-full h-1/2 inline-block gap-3 mt-6 lg:pt-5 lg:flex lg:w-1/2 lg:h-40">
          <div className="w-full stats shadow-2xl border-4 border-indigo-200 border-l-yellow-500">
            <div className="stat">
              <div className="stat-title">Active Campaign</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data?.data?.total_campaign}
              </div>
            </div>
          </div>
          <div className="w-full stats shadow-2xl border-4 border-indigo-200 border-l-yellow-500">
            <div className="stat">
              <div className="stat-title">Active Actions</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data?.data?.total_action}
              </div>
            </div>
          </div>
          <div className="w-full stats shadow-2xl border-4 border-indigo-200 border-l-yellow-500">
            <div className="stat">
              <div className="stat-title">Users</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data?.data?.total_users}
              </div>
            </div>
          </div>
          <div className="w-full stats shadow-2xl border-4 border-indigo-200 border-l-yellow-500">
            <div className="stat">
              <div className="stat-title">Packages</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data?.data?.total_package}
              </div>
            </div>
          </div>
        </div>   
       </div>
    </div>
  );
}

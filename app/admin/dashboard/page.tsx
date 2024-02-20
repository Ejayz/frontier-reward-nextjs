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
      return data;
    },
  });
  return (
    <div className="w-full h-screen bg-white flex flex-col mx-auto">
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
      <div className="w-full flex text-black flex-col  lg:flex-row">
        <div className="w-1/2 h-full mt-24 flex flex-row">
          <Chart
            options={RedeemTransactions.options}
            series={isLoading || isFetching ? [0, 0, 0] : data.data.redeem}
            type="pie"
            width={350}
            height={350}
            className="shadow-ml"
          />
          <Chart
            options={CampaignTransactions.options}
            series={isLoading || isFetching ? [0, 0, 0] : data.data.campaign}
            type="pie"
            width={350}
            height={350}
            className="shadow-ml"
          />
        </div>
        <div className="lg:w-1/2 w-full grid gap-2 mt-24 p-4 grid-cols-2 ">
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Active Campaign</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data.data.total_campaign}
              </div>
            </div>
          </div>
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Active Actions</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data.data.total_action}
              </div>
            </div>
          </div>
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Users</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data.data.total_users}
              </div>
            </div>
          </div>
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Packages</div>
              <div className="stat-value">
                {isLoading || isFetching ? "..." : data.data.total_package}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

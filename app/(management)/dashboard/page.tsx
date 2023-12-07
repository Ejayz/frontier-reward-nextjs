"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState } from "react";

export default function page() {
  const [carousel, setCarousel] = useState(1);
  const [transactions, setTransactions] = useState({
    options: {
      title: {
        text: "Transactions",
      },
      noData: {
        text: "No data",
      },
      labels: ["Cancelled", "Pending", "Confirmed", "Completed"],
      colors: ["#d8334a", "#ffd11f", "#f9a72b", "#ffeea3"],
    },
    series: [20, 60, 100, 90],
  });
  return (
    <div className="w-full h-screen bg-white flex flex-col mx-auto">
      <div className="carousel w-full mt-2 mx-auto">
        {carousel == 1 ? (
          <div id="slide1" className="carousel-item relative w-full">
            <img src="/images/slider-1.png" className="w-full" />
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
        ) : (
          <div id="slide2" className="carousel-item relative w-full">
            <img src="../images/slider-2.png" className="w-full" />
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
      <div className="w-full flex text-black flex-row">
        <div className="w-1/2">
          <Chart
            options={transactions.options}
            series={transactions.series}
            type="pie"
            width={500}
            height={320}
            className="shadow-ml"
          />
        </div>
        <div className="w-1/2 grid gap-12 p-6 grid-cols-2 ">
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Active Campaign</div>
              <div className="stat-value">89,400</div>
            </div>
          </div>
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Active Actions</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Users</div>
              <div className="stat-value">89,400</div>
            </div>
          </div>
          <div className="stats shadow-2xl">
            <div className="stat">
              <div className="stat-title">Packages</div>
              <div className="stat-value">89,400</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

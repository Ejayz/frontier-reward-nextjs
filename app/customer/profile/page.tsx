"use client";
import CarInfromationListCustomer from "@/components/ProfileCarInformationList";
import ProfileCard from "@/components/CustomerProfileCard";
import RedeemTransactionList from "@/components/ProfileRedeemTransactionList";
import TransactionList from "@/components/ProfileTransactionList";
import Image from "next/image";
import { useState } from "react";
export default function Page() {
  const [activeTab, setActiveTab] = useState("car_list");
  return (
    <div className="w-full h-full flex flex-row overflow-y-auto">
      <div className="card w-1/4 h-full">
        <ProfileCard />
      </div>
      <div className="w-3/4 flex flex-col p-4 h-full">
        <div role="tablist" className="tabs tabs-bordered">
          <a
            role="tab"
            onClick={() => {
              setActiveTab("car_list");
            }}
            className={`tab ${activeTab == "car_list" ? "tab-active" : ""}`}
          >
            Car List
          </a>
          <a
            role="tab"
            onClick={() => {
              setActiveTab("transaction_list");
            }}
            className={`tab ${
              activeTab == "transaction_list" ? "tab-active" : ""
            }`}
          >
            Campaign Transaction List
          </a>
          <a
            role="tab"
            onClick={() => {
              setActiveTab("redeem_list");
            }}
            className={`tab ${activeTab == "redeem_list" ? "tab-active" : ""}`}
          >
            Redeem List
          </a>
        </div>
        <div className="w-full h-full">
          {activeTab == "car_list" ? (
            <CarInfromationListCustomer />
          ) : activeTab == "transaction_list" ? (
            <TransactionList />
          ) : (
            <RedeemTransactionList />
          )}
        </div>
      </div>
    </div>
  );
}

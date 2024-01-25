"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
import Image from "next/image";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { start } from "repl";
import { tree } from "next/dist/build/templates/app-page";
import { create } from "domain";

type Element = {
  id: number;
  package_id: number;
  reward_id: number;
  created_at: string;
  is_exist: number;
};

type PackageElement = {
  id: number;
  name: string;
  description: string;
  multiplier: number;
  updated_at: string;
  created_at: string;
  is_exist: number;
};
export default function Page() {
  const [processing, setProcessing] = useState(false);
  const createPackageRef = useRef<FormikProps<any>>(null);
  const editPackageRef = useRef<FormikProps<any>>(null);
  const createPackageRewardRef = useRef<FormikProps<any>>(null);
  const [page, setPage] = useState(1);

  const { showToast } = useToast();

  return (
    <div className="w-full h-full pl-10">
      {/* add modal */}
      <label htmlFor="my_modal_6" className="btn btn-primary ">
        Add Redeem
      </label>

      <div className="overflow-x-auto mt-5 text-black">
        <table className="table  text-base font-semibold text-center">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Multiplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div className="w-11/12 flex mx-auto">
          <div className="join mx-auto">
            <button className="join-item btn">«</button>
            <button className="join-item btn">1</button>
            <button className="join-item btn">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}

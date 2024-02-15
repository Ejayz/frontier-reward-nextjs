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
import LabeledInput from "@/components/LabeledInput";
import LabeledSelectInput from "@/components/LabeledSelectInput";
import { parse } from "path";
import { toast } from "react-toastify";
import Loading from "../loading";
import { get } from "http";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [redeemPage, setRedeemPage] = useState(0);
  const addRedeemModal = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const addRedeemForm = useRef<FormikProps<any>>(null);
  const updateRedeemForm = useRef<FormikProps<any>>(null);
  const updateRedeemModal = useRef<HTMLDialogElement>(null);
  const [updatableId, setUpdatableId] = useState(0);
  const {
    data: getRewards,
    isLoading: isRewardsLoading,
    isFetching: isRewardsFetching,
  } = useQuery({
    queryKey: ["getRewards"],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/displayRewards/", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: getPackages,
    isLoading: isPackagesLoading,
    isFetching: isPackagesFetching,
  } = useQuery({
    queryKey: ["getPackages"],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/displayPackages/", {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const addRedeemValidation = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    cost: yup.number().required("Cost is required").min(1),
    package_id: yup.string().required("Package is required"),
    reward_id: yup.string().required("Reward is required"),
  });
  const addRedeemMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/createRedeem/", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });

      let data = await response.json();
      return data;
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: (data: any) => {
      toast.success(data.message);
      addRedeemForm.current?.resetForm();
      addRedeemModal.current?.click();
    },
  });

  const {
    data: getRedeemable,
    isLoading: isRedeemableLoading,
    isFetching: isRedeemableFetching,
    refetch: refetchRedeemable,
  } = useQuery({
    queryKey: ["getRedeemable", redeemPage,searchTerm],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch(`/api/private/getRedeem?page=${redeemPage}`, {
        method: "GET",
        headers: headersList,
      });

      let data = await response.json();
      return data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const removeRedeemMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/removeRedeem/", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });

      let data = await response.json();
      return data;
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: (data: any) => {
      if (data.code == 200) {
        refetchRedeemable();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
  });
  const {
    data: getUpdateRedeemData,
    isLoading: isUpdateRedeemLoading,
    isFetching: isUpdateRedeemFetching,
    refetch: refetchUpdateRedeem,
  } = useQuery({
    queryKey: ["getUpdateRedeem", updatableId],
    queryFn: async () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "content-type": "application/json",
      };

      let response = await fetch(`/api/private/getRedeemData/`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ id: updatableId }),
      });

      let data = await response.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const updateRedeemMutation = useMutation({
    mutationFn: async (values: any) => {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      };

      let response = await fetch("/api/private/updateRedeem/", {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(values),
      });

      let data = await response.json();
      return data;
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: (data: any) => {
      if (data.code == 200) {
        refetchRedeemable();
        refetchUpdateRedeem();
        toast.success(data.message);
        updateRedeemForm.current?.resetForm();
        updateRedeemModal.current?.close();
      } else {
        toast.error(data.message);
      }
    },
  });

  return (
    <div className="w-full h-full px-2">
      {/* Update Modal*/}

      <dialog ref={updateRedeemModal} id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Update Redeemable</h3>
          {isUpdateRedeemLoading || isUpdateRedeemFetching ? (
            <div className="w-full h-3/4  overflow-hiden">
              <span>Please wait while we load data</span>
            </div>
          ) : getUpdateRedeemData == undefined ||
            getUpdateRedeemData.code != 200 ? (
            <>
              <p className="py-4">No data found .</p>

              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </>
          ) : (
            <Formik
              innerRef={updateRedeemForm}
              initialValues={{
                name:
                  isUpdateRedeemFetching || isUpdateRedeemFetching
                    ? ""
                    : updatableId == 0
                    ? ""
                    : getUpdateRedeemData.data?.name,
                description:
                  isUpdateRedeemFetching || isUpdateRedeemFetching
                    ? ""
                    : updatableId == 0
                    ? ""
                    : getUpdateRedeemData.data?.description,
                cost:
                  isUpdateRedeemFetching || isUpdateRedeemFetching
                    ? ""
                    : updatableId == 0
                    ? ""
                    : getUpdateRedeemData.data?.point_cost,
                package_id:
                  isUpdateRedeemFetching || isUpdateRedeemFetching
                    ? ""
                    : updatableId == 0
                    ? ""
                    : getUpdateRedeemData.data?.package_id,
                reward_id:
                  isUpdateRedeemFetching || isUpdateRedeemFetching
                    ? ""
                    : updatableId == 0
                    ? ""
                    : getUpdateRedeemData.data?.reward_id,
              }}
              onSubmit={(values: any) => {
                const data = {
                  id: updatableId,
                  name: values.name,
                  description: values.description,
                  cost: values.cost,
                  package_id: parseInt(values.package_id),
                  reward_id: parseInt(values.reward_id),
                };
                updateRedeemMutation.mutate(data);
              }}
              validationSchema={addRedeemValidation}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <LabeledInput
                    field_name="name"
                    type="text"
                    placeholder="Redeemable Name"
                    className="input input-bordered"
                    errors={errors.name}
                    touched={touched.name}
                    classes="mb-2"
                    label="Name"
                  />
                  <LabeledInput
                    field_name="description"
                    type="text"
                    placeholder="Redeemable Description"
                    className="input input-bordered"
                    errors={errors.description}
                    touched={touched.description}
                    classes="mb-2"
                    label="Description"
                  />
                  <LabeledInput
                    field_name="cost"
                    type="number"
                    placeholder="Redeemable Cost"
                    className="input input-bordered"
                    errors={errors.cost}
                    touched={touched.cost}
                    classes="mb-2"
                    label="Cost"
                  />
                  <LabeledSelectInput
                    field_name="package_id"
                    placeholder="Packages"
                    className="input input-bordered"
                    errors={errors.package_id}
                    touched={touched.package_id}
                    classes="mb-2"
                    label="Package"
                    SelectOptions={
                      isPackagesFetching || isPackagesLoading
                        ? []
                        : getPackages.data
                    }
                    setFieldValue={setFieldValue}
                    values={values.package_id}
                  />
                  <LabeledSelectInput
                    field_name="reward_id"
                    placeholder="Reward Redeemable"
                    className="input input-bordered"
                    errors={errors.reward_id}
                    touched={touched.reward_id}
                    classes="mb-2"
                    label="Reward"
                    SelectOptions={
                      isRewardsFetching || isRewardsLoading
                        ? []
                        : getRewards.data
                    }
                    setFieldValue={setFieldValue}
                    values={values.reward_id}
                  />

                  <div className="modal-action">
                    <button type="submit" className="btn btn-primary">
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        updateRedeemForm.current?.resetForm();
                        updateRedeemModal.current?.close();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </dialog>

      {/* add modal */}
      <label htmlFor="addRedeemModal" className="btn btn-primary ">
        Add Redeem
      </label>
      <input
        ref={addRedeemModal}
        type="checkbox"
        id="addRedeemModal"
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Redeemable</h3>
          <Formik
            innerRef={addRedeemForm}
            initialValues={{
              name: "",
              description: "",
              cost: 0,
              package_id: "",
              reward_id: "",
            }}
            onSubmit={(values: any) => {
              const data = {
                name: values.name,
                description: values.description,
                cost: values.cost,
                package_id: parseInt(values.package_id),
                reward_id: parseInt(values.reward_id),
              };
              addRedeemMutation.mutate(data);
            }}
            validationSchema={addRedeemValidation}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <LabeledInput
                  field_name="name"
                  type="text"
                  placeholder="Redeemable Name"
                  className="input input-bordered"
                  errors={errors.name}
                  touched={touched.name}
                  classes="mb-2"
                  label="Name"
                />
                <LabeledInput
                  field_name="description"
                  type="text"
                  placeholder="Redeemable Description"
                  className="input input-bordered"
                  errors={errors.description}
                  touched={touched.description}
                  classes="mb-2"
                  label="Description"
                />
                <LabeledInput
                  field_name="cost"
                  type="number"
                  placeholder="Redeemable Cost"
                  className="input input-bordered"
                  errors={errors.cost}
                  touched={touched.cost}
                  classes="mb-2"
                  label="Cost"
                />
                <LabeledSelectInput
                  field_name="reward_id"
                  placeholder="Redeemable Reward"
                  className="input input-bordered"
                  errors={errors.package_id}
                  touched={touched.package_id}
                  classes="mb-2"
                  label="Package"
                  SelectOptions={
                    isPackagesFetching || isPackagesLoading
                      ? []
                      : getPackages.data
                  }
                  setFieldValue={setFieldValue}
                  values={values.reward_id}
                />
                <LabeledSelectInput
                  field_name="package_id"
                  placeholder="Package"
                  className="input input-bordered"
                  errors={errors.package_id}
                  touched={touched.package_id}
                  classes="mb-2"
                  label="Reward"
                  SelectOptions={
                    isRewardsFetching || isRewardsLoading ? [] : getRewards.data
                  }
                  setFieldValue={setFieldValue}
                  values={values.package_id}
                />

                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                  <label
                    htmlFor="addRedeemModal"
                    className="btn"
                    onClick={() => {
                      addRedeemForm.current?.resetForm();
                    }}
                  >
                    Close
                  </label>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="overflow-x-auto w-full h-full mt-5 text-black">
        <table className="table place-content-center table-zebra text-base font-semibold text-center table-sm lg:table-lg">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Rewards</th>
              <th>Package</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isRedeemableFetching || isRedeemableLoading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  <span className="loading loading-spinner loading-md"></span>
                </td>
              </tr>
            ) : getRedeemable.data.length == 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No redeemable found.
                </td>
              </tr>
            ) : (
              getRedeemable.data.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td>{item.redeem_name}</td>
                    <td>{item.redeem_description}</td>
                    <td>{`${item.point_cost} Frontier Points`}</td>
                    <td>{item.reward_name}</td>
                    <td>{item.package_name}</td>
                    <td>
                      <button
                        onClick={async () => {
                          await setUpdatableId(item.redeem_id);
                          await updateRedeemModal.current?.showModal();
                        }}
                        className="btn btn-sm mx-5 btn-info"
                      >
                        <Image
                          src="/icons/editicon.svg"
                          alt="edit"
                          width={20}
                          height={20}
                        />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          const confirm = window.confirm(
                            "Are you sure you want to delete this?"
                          );
                          if (confirm) {
                            removeRedeemMutation.mutate({
                              id: item.redeem_id,
                            });
                          }
                        }}
                        className="btn btn-sm btn-error"
                      >
                        <Image
                          src="/icons/deleteicon.svg"
                          alt="edit"
                          width={20}
                          height={20}
                        />
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="w-11/12 flex mx-auto">
          <div className="join mx-auto">
            <button
              onClick={() => {
                if (redeemPage > 0) {
                  setRedeemPage(redeemPage - 1);
                }
              }}
              className="join-item btn"
            >
              «
            </button>
            <button className="join-item btn">Page {redeemPage + 1}</button>
            <button
              onClick={() => {
                if (getRedeemable.data.length == 10) {
                  setRedeemPage(redeemPage + 1);
                }
              }}
              className="join-item btn"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

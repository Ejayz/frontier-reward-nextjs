"use client";
import React, { useRef, useState } from "react";

export default function Page() {
  const [userType, setUserType] = useState("");
  const modal = useRef<HTMLDialogElement>(null);
  const handleUserTypeChange = (event: any) => {
    setUserType(event.target.value);
  };
  return (
    <div className="pl-10">
      <button
        className="btn btn-info"
        onClick={() => modal.current?.showModal()}
      >
        Add Campaigns
      </button>
      <dialog id="my_modal_3" ref={modal} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => modal.current?.close()}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Action</h3>
          <div className="form-control bg-white">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Action Name"
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              placeholder="Enter Action Description"
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              placeholder="Enter Action Start Date"
              className="input input-bordered"
            />
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <input
              type="date"
              placeholder="Enter Action End Date"
              className="input input-bordered"
            />
          </div>
          <div className="m-8 " style={{ marginTop: 60 }}>
            <div className="absolute bottom-6 right-6">
              <button className="btn btn-neutral mr-2">Cancel</button>
              <button className="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </dialog>

      <div className="overflow-x-auto mt-5 text-black">
        <table className="table text-base font-semibold">
          {/* head */}
          <thead className="bg-gray-900 rounded-lg text-white font-semibold">
            <tr className="rounded-lg">
              <th>Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="row">
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>date</td>
              <td>dates</td>

              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 2 */}
            <tr className="row">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>date</td>
              <td>dates</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>date</td>
              <td>dates</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>date</td>
              <td>dates</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>date</td>
              <td>dates</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>date</td>
              <td>dates</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>date</td>
              <td>dates</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
            {/* row 3 */}
            <tr className="row">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>date</td>
              <td>dates</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <td>
                <button className="btn btn-sm btn-info mr-5">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="join">
          <button className="join-item btn btn-outline">Previous page</button>
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="1"
            checked
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="2"
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="3"
          />
          <input
            className="join-item btn btn-square"
            type="radio"
            name="options"
            aria-label="4"
          />
          <button className="join-item btn btn-outline">Next</button>
        </div>
      </div>
    </div>
  );
}

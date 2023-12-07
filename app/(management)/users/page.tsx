"use client";
import React, { useState } from 'react';

export default function Page() {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (event) => {
      setUserType(event.target.value);
    };
  return (
    <div className="ml-80 mt-20">
{/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn btn-info" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button>
<dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById('my_modal_3').close()}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add User</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={userType}
              onChange={handleUserTypeChange}
            >
              <option value="">Select an option</option>
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
            </select>
            {userType === 'Customer' && (
              <div className='customer'>
                <label className="label">
                  <span className="label-text">Customer ID</span>
                </label>
                <input type="text" placeholder="Enter Customer ID" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input type="text" placeholder="Enter First Name" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input type="text" placeholder="Enter Last Name" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="Enter Email" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input type="tel" placeholder="Enter Phone Number" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Points</span>
                </label>
                <input type="text" placeholder="Enter Points" className="input input-bordered" />
                <label className="label">
                    <span className="label-text">Package</span>
                </label>
                <select>
                <option value="active">Gold Package</option>
                    <option value="active">Frontier Package</option>
                </select>

                <label className="label">
                    <span className="label-text">Vihicle #</span>
                    </label>
                <label className="label">
                    <span className="label-text">ID</span>
                    </label>
                    <input type="text" placeholder="Enter Vehicle ID" className="input input-bordered" />

                    <label className="label">
                    <span className="label-text">Year</span>
                    </label>
                    <input type="text" placeholder="Enter Vehicle Year" className="input input-bordered" />

                    <label className="label">
                    <span className="label-text">Model</span>
                    </label>
                    <input type="text" placeholder="Enter Vehicle Model" className="input input-bordered" />
                    <label className="label">
                    <span className="label-text">Trim</span>
                    </label>
                    <input type="text" placeholder="Enter Vehicle Trim" className="input input-bordered" />
                    <label className="label">
                    <span className="label-text">Color</span>
                    </label>
                    <input type="text" placeholder="Enter Vehicle Color" className="input input-bordered" />
                    <label className="label">
                    <span className="label-text">Vin No.</span>
                    </label>
                    <input type="text" placeholder="Enter Vehicle Number" className="input input-bordered" />
                    
                    <button className="btn btn-primary mt-4">Add Vehicle</button>

              </div>
            )}

            {userType === 'Admin' && (
              <div className='admin'>
                <label className="label">
                  <span className="label-text">Firs Name</span>
                </label>
                <input type="text" placeholder="Enter First Name" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Middle Name</span>
                </label>
                <input type="text" placeholder="Enter First Name" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input type="text" placeholder="Enter Last Name" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="Enter Email" className="input input-bordered" />
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input type="tel" placeholder="Enter Phone Number" className="input input-bordered" />

               
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
    
  );
}


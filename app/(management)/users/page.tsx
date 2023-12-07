"use client";
import React, { useState } from 'react';

export default function Page() {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (event) => {
      setUserType(event.target.value);
    };
  return (
    <div className="pl-10">
{/* You can open the modal using document.getElementById('ID').showModal() method */}
<button className="btn btn-info" onClick={()=>document.getElementById('my_modal_3').showModal()}>Add User</button>
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
              <option value="Super Admin">Super Admin</option>
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
                    <br/>
                    <button className="btn btn-primary mt-4">Add Vehicle</button>
                    <div className="relative "style={{marginTop:60}}>
            <div className="absolute bottom-6 right-6">
          <button className="btn btn-neutral mr-2">Cancel</button>
    <button className="btn btn-primary">Submit</button>
    </div></div>
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

                <div className="m-8 "style={{marginTop:60}}>
            <div className="absolute bottom-6 right-6">
          <button className="btn btn-neutral mr-2">Cancel</button>
    <button className="btn btn-primary">Submit</button>
    </div></div>
              </div>

              
            )}
          </div>
        </div>
      </dialog>
{/* filters */}
      <div className="form-control">
        <div className='flex'>
        <div className="relative w-full">
        <label className="label text-base font-semibold text-black">
        <span className="label-text text-base font-semibold text-black">Type</span>
      </label>
      <select
        className="select select-bordered w-full max-w-xs"
        value={userType}
        onChange={handleUserTypeChange}
      >
        <option value="">Select an option</option>
        <option value="Customer">Customer</option>
        <option value="Admin">Admin</option>
        <option value="Super Admin">Super Admin</option>
      </select>
          </div>
          <div className="relative w-full">
            <label className="label">
          <span className="label-text text-base font-semibold text-black">Customer ID</span>
        </label>
        <input type="text" placeholder="Enter Customer ID" className="input input-bordered" />
            </div>

            <div className="relative w-full">
               <label className="label">
          <span className="label-text text-base font-semibold text-black">Name</span>
        </label>
        <input type="text" placeholder="Enter Name" className="input input-bordered" />
              </div>
              <div className="relative w-full">
                <label className="label">
          <span className="label-text text-base font-semibold text-black">Email</span>
        </label>
        <input type="email" placeholder="Enter Email" className="input input-bordered" />
                 </div>
        </div>
     
       
        
        </div>

      <div className="overflow-x-auto mt-5 text-black">
  <table className="table text-base font-semibold">
    {/* head */}
    <thead className='bg-gray-900 rounded-lg text-white font-semibold'>
      <tr className='rounded-lg'>
        <th>ID</th>
        <th>Name</th>
        <th>Type</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Package</th>
        <th>Created</th>
        <th>Updated</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr className='row'>
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
      {/* row 2 */}
      <tr className='row'>
        <th>2</th>
        <td>Hart Hagerty</td>
        <td>Desktop Support Technician</td>
        <td>Purple</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
      {/* row 3 */}
      <tr className='row'>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
        {/* row 3 */}
        <tr className='row'>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
        {/* row 3 */}
        <tr className='row'>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
        {/* row 3 */}
        <tr className='row'>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
        {/* row 3 */}
        <tr className='row'>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
        {/* row 3 */}
        <tr className='row'>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Red</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>Blue</td>
        <td>
          <button className='btn btn-sm btn-info mr-5'>Edit</button>
          <button className='btn btn-sm btn-error'>Delete</button>
        </td> 
      </tr>
    </tbody>
  </table>
  <div className="join">
  <button className="join-item btn btn-outline">Previous page</button>
  <input className="join-item btn btn-square" type="radio" name="options" aria-label="1" checked />
  <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" />
  <input className="join-item btn btn-square" type="radio" name="options" aria-label="3" />
  <input className="join-item btn btn-square" type="radio" name="options" aria-label="4" />
  <button className="join-item btn btn-outline">Next</button>
</div>
</div>
    </div>
    
  );
}


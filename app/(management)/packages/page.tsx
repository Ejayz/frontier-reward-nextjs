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
<button className="btn btn-info" onClick={()=>document.getElementById('my_modal_3').showModal()}>Add Packages</button>
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
          <h3 className="font-bold text-lg">Add Action</h3>
          <div className="form-control bg-white">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input type="text" placeholder="Enter Package Name" className="input input-bordered" />
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input type="text" placeholder="Enter Package Description" className="input input-bordered" />
          </div>
          <label className="label">
                <span className="label-text">Multiplier</span>
                </label>
                <input type="text" placeholder="Enter Package Multiplier" className="input input-bordered" />

                <label className="label">
                <span className="label-text">Rewards</span>
                </label>
                <select className="select select-bordered w-full max-w-xs">
                <option selected="selected">Select Reward (make multiple selection)</option>
                <option>Option 1</option>
                <option>Option 2</option>
                </select>
          <div className="m-8 "style={{marginTop:60}}>
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
    <thead className='bg-gray-900 rounded-lg text-white font-semibold'>
      <tr className='rounded-lg'>
        
        <th>Name</th>
        <th>Description</th>
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


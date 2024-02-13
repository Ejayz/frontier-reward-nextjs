"use client";

import Image from "next/image";
export default function Page() {

  return (
    <div className="w-full h-full">
      <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Job</th>
        <th>Favorite Color</th>
        <th>Actions</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      <tr className="bg-base-200">
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td className="flex ">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                            className="hide-icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                     
                        >
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                            className="hide-icon"
                          />
                          Delete
                        </label>
                   
                    </td>
      </tr>
      <tr className="bg-base-200">
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td className="flex ">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                            className="hide-icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                     
                        >
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                            className="hide-icon"
                          />
                          Delete
                        </label>
                   
                    </td>
      </tr>
      <tr className="bg-base-200">
        <th>1</th>
        <td>Cy Ganderton</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td className="flex ">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                            className="hide-icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                     
                        >
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                            className="hide-icon"
                          />
                          Delete
                        </label>
                   
                    </td>
      </tr>
      {/* row 2 */}
      <tr>
        <th>2</th>
        <td>Hart Hagerty</td>
        <td>Desktop Support Technician</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td> 
        <td className="flex">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                        
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                     
                        >
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                          />
                          Delete
                        </label>
                   
                    </td>
      </tr>
      {/* row 3 */}
      <tr>
        <th>3</th>
        <td>Brice Swyre</td>
        <td>Tax Accountant</td>
        <td>Quality Control Specialist</td>
        <td>Quality Control Specialist</td>
        <td className="flex">
                        <label
                          htmlFor="my_modal_7"
                          className="btn btn-sm btn-info mr-2"
                        
                        >
                          <Image
                            src="/icons/editicon.svg"
                            width={20}
                            height={20}
                            alt="Edit Icon"
                          />
                          Edit
                        </label>
                        <label htmlFor="my_modal_8" className="btn btn-sm btn-error"
                     
                        >
                          <Image
                            src="/icons/deleteicon.svg"
                            width={20}
                            height={20}
                            alt="Delete Icon"
                          />
                          Delete
                        </label>
                   
                    </td>
      </tr>
    </tbody>
  </table>
</div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Vendor {
  id?: number;
  vendorName: string;
  registerAddress: string;
  gstNo: string;
  contactName: string;
  contactNumber: string;
  emailId: string;
  hodId?:number;
  managerId?:number;
}

const initialFormState: Vendor = {
  vendorName: "",
  registerAddress: "",
  gstNo: "",
  contactName: "",
  contactNumber: "",
  emailId: "",
};

const VendorTable: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState<Vendor>({
    vendorName: '',
    registerAddress: '',
    gstNo: '',
    contactName: '',
    contactNumber: '',
    emailId: '',
  });

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/vendors/${id}`);
      alert("Vendor deleted successfully!");
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/vendors", formData);
      alert("Vendor created successfully!");
      setFormData(initialFormState); // Reset form
      setIsCreateModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error creating vendor:", error);
    }
  };
  
  const handleUpdate = async () => {
    if (!selectedVendor) return;
    try {
      await axios.put(`http://localhost:8000/vendors/${selectedVendor.id}`, formData);
      alert("Vendor updated successfully!");
      setFormData(initialFormState); // Reset form
      setSelectedVendor(null);
      setIsUpdateModalOpen(false);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData(vendor); 
    setIsUpdateModalOpen(true);
  };

  const handleCancel = () => {
    setFormData(initialFormState); // Reset form
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedVendor(null);
  };
  
  useEffect(() => {
    fetchVendors();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentVendors = vendors.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen mt-3">
      <div className="flex-1 p-6 overflow-auto lg:ml-72 "> 
        <div className="flex justify-between items-center mb-5 mt-16">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Vendor
          </button>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100vw" }}>
          <table className="min-w-[700px] w-full text-center border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Vendor Name</th>
                <th className="border border-gray-300 p-2">Contact Name</th>
                <th className="border border-gray-300 p-2">Contact Number</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{vendor.vendorName}</td>
                  <td className="border border-gray-300 p-2">{vendor.contactName}</td>
                  <td className="border border-gray-300 p-2">{vendor.contactNumber}</td>
                  <td className="border border-gray-300 p-2">{vendor.emailId}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditClick(vendor)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                      aria-label="Edit Vendor"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id!)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      aria-label="Delete Vendor"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {/* Page Numbers */}
          {[...Array(Math.ceil(vendors.length / itemsPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
              } hover:bg-blue-400`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
            disabled={currentPage === Math.ceil(vendors.length / itemsPerPage)}
          >
            Next
          </button>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-4">
      <h2 className="text-xl font-bold mb-4 text-center">Add New Vendor</h2>

      <input
        type="text"
        name="vendorName"
        value={formData.vendorName}
        onChange={handleInputChange}
        placeholder="Vendor Name"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="registerAddress"
        value={formData.registerAddress}
        onChange={handleInputChange}
        placeholder="Address"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="gstNo"
        value={formData.gstNo}
        onChange={handleInputChange}
        placeholder="GST No."
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="contactName"
        value={formData.contactName}
        onChange={handleInputChange}
        placeholder="Contact Name"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleInputChange}
        placeholder="Contact Number"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="email"
        name="emailId"
        value={formData.emailId}
        onChange={handleInputChange}
        placeholder="Email"
        className="border p-3 mb-3 w-full rounded"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Create Vendor
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

{/* Update Modal */}
{isUpdateModalOpen && selectedVendor && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-4">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Vendor</h2>

      <input
        type="text"
        name="vendorName"
        value={formData.vendorName}
        onChange={handleInputChange}
        placeholder="Vendor Name"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="registerAddress"
        value={formData.registerAddress}
        onChange={handleInputChange}
        placeholder="Address"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="gstNo"
        value={formData.gstNo}
        onChange={handleInputChange}
        placeholder="GST No."
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="contactName"
        value={formData.contactName}
        onChange={handleInputChange}
        placeholder="Contact Name"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleInputChange}
        placeholder="Contact Number"
        className="border p-3 mb-3 w-full rounded"
      />

      <input
        type="email"
        name="emailId"
        value={formData.emailId}
        onChange={handleInputChange}
        placeholder="Email"
        className="border p-3 mb-3 w-full rounded"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleUpdate}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full"
        >
          Update Vendor
        </button>
        <button
          onClick={() => setIsUpdateModalOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default VendorTable;

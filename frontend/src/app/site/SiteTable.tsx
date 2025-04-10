"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  id: number;
  customerName: string;
}

interface Site {
  id: number;
  siteId: string;
  customerId: number;
  siteName: string;
  siteAddress:string;
  contactName:string;
  contactNumber: string;
  emailId: string;
  Customer: Customer; 
}

const SiteTable: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState({
    siteId: "",
    siteName: "",
    siteAddress: "",
    contactName: "",
    contactNumber: "",
    emailId: "",
    customerId: 0,
  });

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

  const fetchSites = async () => {
    try {
      const response = await axios.get("http://localhost:8000/sites");
      setSites(response.data.reverse());
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "customerId" ? Number(value) : value,
    }));
  };

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/sites", formData);
      alert("Site added successfully!");
      setIsCreateModalOpen(false);
      fetchSites();
    } catch (error) {
      console.error("Error adding site:", error);
    }
  };

  const handleUpdate = async () => {
    if (selectedSite) {
      try {
        await axios.put(
          `http://localhost:8000/sites/${selectedSite.id}`,
          formData
        );
        alert("Site updated successfully!");
        setIsUpdateModalOpen(false);
        fetchSites();
      } catch (error) {
        console.error("Error updating site:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      try {
        await axios.delete(`http://localhost:8000/sites/${id}`);
        alert("Site deleted successfully!");
        fetchSites();
      } catch (error) {
        console.error("Error deleting site:", error);
      }
    }
  };

  useEffect(() => {
    fetchSites();
    fetchCustomers();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentSites = sites.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen mt-3">
      <div className="flex-1 p-6 overflow-auto lg:ml-72 "> 
        <div className="flex justify-between items-center mb-5 mt-16">
          <button
            onClick={() => {
              setFormData({
                siteId: "",
                siteName: "",
                siteAddress: "",
                contactName: "",
                contactNumber: "",
                emailId: "",
                customerId: 0,
              });
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer Site
          </button>
        </div>
        <div className="overflow-x-auto" style={{ maxWidth: "100vw" }}>
          <table className="min-w-[1100px] w-full text-center border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Site Name</th>
                <th className="border border-gray-300 px-4 py-2">Site Address</th>
                <th className="border border-gray-300 px-4 py-2">Contact Name</th>
                <th className="border border-gray-300 px-4 py-2">Contact Number</th>
                <th className="border border-gray-300 px-4 py-2">Email ID</th>
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{site.siteName}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.siteAddress}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.contactName}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.contactNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.emailId}</td>
                  <td className="border border-gray-300 px-4 py-2">{site.Customer.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedSite(site);
                        setFormData({
                          siteId: site.siteId,
                          siteName: site.siteName,
                          siteAddress: site.siteAddress,
                          contactName: site.contactName,
                          contactNumber: site.contactNumber,
                          emailId: site.emailId,
                          customerId: site.customerId,
                        });
                        setIsUpdateModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
          {[...Array(Math.ceil(sites.length / itemsPerPage))].map((_, index) => (
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
            disabled={currentPage === Math.ceil(sites.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>

      {isCreateModalOpen && (
        <Modal
          title="Add Customer Site"
          formData={formData}
          customers={customers}
          onInputChange={handleInputChange}
          onSave={handleCreate}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {isUpdateModalOpen && (
        <Modal
          title="Update Site"
          formData={formData}
          customers={customers}
          onInputChange={handleInputChange}
          onSave={handleUpdate}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
    </div>
  );
};

const Modal: React.FC<{
  title: string;
  formData: any;
  customers: Customer[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ title, formData, customers, onInputChange, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <select
        name="customerId"
        value={formData.customerId}
        onChange={onInputChange}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="">Select Customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.customerName}
          </option>
        ))}
      </select>
      <input
        name="siteId"
        value={formData.siteId}
        onChange={onInputChange}
        placeholder="Site ID"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="siteName"
        value={formData.siteName}
        onChange={onInputChange}
        placeholder="Site Name"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="siteAddress"
        value={formData.siteAddress}
        onChange={onInputChange}
        placeholder="Site Address"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="contactName"
        value={formData.contactName}
        onChange={onInputChange}
        placeholder="Contact Name"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="contactNumber"
        value={formData.contactNumber}
        onChange={onInputChange}
        placeholder="Contact Number"
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        name="emailId"
        value={formData.emailId}
        onChange={onInputChange}
        placeholder="Email ID"
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex justify-end space-x-2">
        <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default SiteTable;

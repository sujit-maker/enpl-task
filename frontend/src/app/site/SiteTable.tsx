"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilLine, Trash2 } from "lucide-react";

// Type Definitions
interface Customer {
  id: number;
  customerName: string;
}

interface Site {
  id: number;
  siteId: string;
  customerId: number;
  siteName: string;
  siteAddress: string;
  contactName: string[];
  contactNumber: string[];
  emailId: string[];
  Customer: Customer;
}

interface FormData {
  siteId: string;
  siteName: string;
  siteAddress: string;
  contactName: string[];
  contactNumber: string[];
  emailId: string[];
  customerId: number;
}

const SiteTable: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [formData, setFormData] = useState<FormData>({
    siteId: "",
    siteName: "",
    siteAddress: "",
    contactName: ["", ""], // Initialize with two fields for demonstration
    contactNumber: ["", ""],
    emailId: ["", ""],
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      // Handle array inputs (contactName, contactNumber, emailId)
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.isArray(prevData[name as keyof FormData])
          ? (prevData[name as keyof FormData] as string[]).map((item, idx) =>
              idx === index ? value : item
            )
          : prevData[name as keyof FormData],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "customerId" ? Number(value) : value,
      }));
    }
  };

  const handleAddField = (field: "contactName" | "contactNumber" | "emailId") => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...(prevData[field as keyof FormData] as string[]), ""],
    }));
  };

  const handleRemoveField = (
    field: "contactName" | "contactNumber" | "emailId",
    index: number
  ) => {
    const updatedField = Array.isArray(formData[field as keyof FormData])
      ? [...(formData[field as keyof FormData] as string[])]
      : [];
    updatedField.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      [field]: updatedField,
    }));
  };

  const handleCreate = async () => {
    const { siteId, siteName, siteAddress, contactName, contactNumber, emailId } = formData;
    if (!siteId || !siteName || !siteAddress || !contactName || !contactNumber || !emailId) {
      alert("Please fill in all required fields.");
      return;
    }
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
      <div className="flex-1 p-6 overflow-auto lg:ml-72">
        <div className="flex justify-between items-center mb-5 mt-16">
          <button
            onClick={() => {
              setFormData({
                siteId: "",
                siteName: "",
                siteAddress: "",
                contactName: ["", ""], // Reset fields
                contactNumber: ["", ""],
                emailId: ["", ""],
                customerId: 0,
              });
              setIsCreateModalOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer Site
          </button>
        </div>
        <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-center border-collapse border border-gray-200">
          <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Site ID</th>
                <th className="px-6 py-3 text-left">Site Name</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Site Address</th>
                <th className="px-6 py-3 text-left">Contact Name</th>
                <th className="px-6 py-3 text-left">Contact Number</th>
                <th className="px-6 py-3 text-left">Email ID</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentSites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-100">
                  <td className="border px-6 py-3">{site.siteId}</td>
                  <td className="border px-6 py-3">{site.siteName}</td>
                  <td className="border px-6 py-3">{site.Customer.customerName}</td>
                  <td className="border px-6 py-3">{site.siteAddress}</td>
                  <td className="border px-6 py-3">{site.contactName.join(", ")}</td>
                  <td className="border px-6 py-3">{site.contactNumber.join(", ")}</td>
                  <td className="border px-6 py-3">{site.emailId.join(", ")}</td>

                  <td className="border px-6 py-3">
  <div className="flex justify-center items-center gap-3">
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
      className="text-blue-500 hover:text-blue-700"
      title="Edit"
    >
      <PencilLine size={18} />
    </button>

    <button
      onClick={() => handleDelete(site.id)}
      className="text-red-500 hover:text-red-700"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Prev
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(sites.length / itemsPerPage)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Add/Update */}
      {isCreateModalOpen && (
        <Modal
          title="Add Customer Site"
          formData={formData}
          customers={customers}
          onInputChange={handleInputChange}
          onAddField={handleAddField}
          onRemoveField={handleRemoveField}
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
          onAddField={handleAddField}
          onRemoveField={handleRemoveField}
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => void;
  onAddField: (field: "contactName" | "contactNumber" | "emailId") => void;
  onRemoveField: (field: "contactName" | "contactNumber" | "emailId", index: number) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ title, formData, customers, onInputChange, onAddField, onRemoveField, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {/* Customer Dropdown */}
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

      {/* Site Fields */}
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

      {/* Dynamic Contact Fields */}
      {formData.contactName.map((_: string, index: number) => (
  <div key={index} className="mb-3 flex items-center">
    <input
      name="contactName"
      value={formData.contactName[index]}
      onChange={(e) => onInputChange(e, index)}
      placeholder="Contact Name"
      className="w-1/3 p-2 border rounded"
    />
    <input
      name="contactNumber"
      value={formData.contactNumber[index]}
      onChange={(e) => onInputChange(e, index)}
      placeholder="Contact Number"
      className="w-1/3 p-2 border rounded ml-2"
    />
    <input
      name="emailId"
      value={formData.emailId[index]}
      onChange={(e) => onInputChange(e, index)}
      placeholder="Email ID"
      className="w-1/3 p-2 border rounded ml-2"
    />
    <button
      type="button"
      onClick={() => {
        const updatedContactName = [...formData.contactName];
        const updatedContactNumber = [...formData.contactNumber];
        const updatedEmailId = [...formData.emailId];
        updatedContactName.splice(index, 1);
        updatedContactNumber.splice(index, 1);
        updatedEmailId.splice(index, 1);
        onInputChange(
          {
            target: {
              name: "contactName",
              value: updatedContactName,
            },
          } as any
        );
        onInputChange(
          {
            target: {
              name: "contactNumber",
              value: updatedContactNumber,
            },
          } as any
        );
        onInputChange(
          {
            target: {
              name: "emailId",
              value: updatedEmailId,
            },
          } as any
        );
      }}
      className="ml-2 text-red-500"
    >
      - Remove
    </button>
  </div>
))}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => onAddField("contactName")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Contact
        </button>
      </div>

      <div className="flex justify-between mt-5">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
        <button
          onClick={onSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default SiteTable;

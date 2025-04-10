"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Customer {
  id?: number;
  customerId: string;
  customerName: string;
  registerAddress: string;
  gstNo: string;
  contactName: string;
  contactNumber: string;
  emailId: string;
}

// Initial empty form state
const initialFormState: Omit<Customer, "id"> = {
  customerId: "",
  customerName: "",
  registerAddress: "",
  gstNo: "",
  contactName: "",
  contactNumber: "",
  emailId: "",
};

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState(initialFormState);


    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/customers");
      setCustomers(response.data.reverse());
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Create new customer
  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/customers", formData);
      alert("Customer added successfully!");
      setFormData(initialFormState); // Reset form after creation
      setIsCreateModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  // Update customer details
  const handleUpdate = async () => {
    if (!selectedCustomer) return;
    try {
      await axios.put(`http://localhost:8000/customers/${selectedCustomer.id}`, formData);
      alert("Customer updated successfully!");
      setFormData(initialFormState); // Reset form after update
      setSelectedCustomer(null);
      setIsUpdateModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // Delete customer
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:8000/customers/${id}`);
        alert("Customer deleted successfully!");
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  // Open update modal with selected customer's data
  const handleUpdateModalOpen = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerId: customer.customerId,
      customerName: customer.customerName,
      registerAddress: customer.registerAddress,
      gstNo: customer.gstNo,
      contactName: customer.contactName,
      contactNumber: customer.contactNumber,
      emailId: customer.emailId,
    });
    setIsUpdateModalOpen(true);
  };

  // Reset form on cancel
  const handleCancel = () => {
    setFormData(initialFormState); // Reset form
    setSelectedCustomer(null);
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = customers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen mt-3">
      <div className="flex-1 p-6 overflow-auto lg:ml-72">
        <div className="flex justify-between items-center mb-5 mt-16">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer
          </button>
        </div>

        <div className="overflow-x-auto" style={{ maxWidth: "100vw" }}>
          <table className="min-w-[1100px] w-full text-center border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">CustomerId</th>
                <th className="border border-gray-300 p-3">CustomerName</th>
                <th className="border border-gray-300 p-3">Register Address</th>
                <th className="border border-gray-300 p-3">GST</th>
                <th className="border border-gray-300 p-3">Contact Name</th>
                <th className="border border-gray-300 p-3">Contact Number</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{customer.customerId}</td>
                  <td className="border border-gray-300 p-3">{customer.customerName}</td>
                  <td className="border border-gray-300 p-3">{customer.registerAddress}</td>
                  <td className="border border-gray-300 p-3">{customer.gstNo}</td>
                  <td className="border border-gray-300 p-3">{customer.contactName}</td>
                  <td className="border border-gray-300 p-3">{customer.contactNumber}</td>
                  <td className="border border-gray-300 p-3">
                    <button
                      onClick={() => handleUpdateModalOpen(customer)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => customer.id && handleDelete(customer.id)}
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
          {[...Array(Math.ceil(customers.length / itemsPerPage))].map((_, index) => (
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
            disabled={currentPage === Math.ceil(customers.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal title="Add Customer" formData={formData} onInputChange={handleInputChange} onSave={handleCreate} onClose={handleCancel} />
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedCustomer && (
        <Modal title="Update Customer" formData={formData} onInputChange={handleInputChange} onSave={handleUpdate} onClose={handleCancel} />
      )}
    </div>
  );
};

// Modal Component for Add and Update
const Modal: React.FC<{
  title: string;
  formData: Omit<Customer, "id">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ title, formData, onInputChange, onSave, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {Object.keys(formData).map((key) => (
        <input
          key={key}
          name={key}
          value={formData[key as keyof typeof formData]}
          onChange={onInputChange}
          placeholder={key.replace(/([A-Z])/g, " $1")}
          className="w-full mb-3 p-2 border rounded"
        />
      ))}
      <div className="flex justify-end space-x-2">
        <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  </div>
);

export default CustomerTable;

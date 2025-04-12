"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilLine, Plus, Trash2 } from "lucide-react";

interface CustomerContact {
  title: string;
  firstName: string;
  lastName: string;
  contactPhoneNumber: string;
  contactEmailId: string;
  designation: string;
  department: string;
  landlineNumber: string;
}

interface BankDetail {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

interface Customer {
  id?: number;
  customerCode: string;
  customerId: string;
  customerName: string;
  registerAddress: string;
  gstNo: string;
  contactName: string;
  contactNumber: string;
  emailId: string;
  website: string;
  products: string[];
  creditTerms: string;
  creditLimit: string;
  remark: string;
  contacts: CustomerContact[];
  bankDetails: BankDetail[];
}

const emptyContact: CustomerContact = {
  title: "",
  firstName: "",
  lastName: "",
  contactPhoneNumber: "",
  contactEmailId: "",
  designation: "",
  department: "",
  landlineNumber: "",
};

const emptyBank: BankDetail = {
  accountNumber: "",
  ifscCode: "",
  bankName: "",
  branchName: "",
};

const initialFormState: Customer = {
  customerCode: "",
  customerId: "",
  customerName: "",
  registerAddress: "",
  gstNo: "",
  contactName: "",
  contactNumber: "",
  emailId: "",
  website: "",
  products: [],
  creditTerms: "",
  creditLimit: "",
  remark: "",
  contacts: [emptyContact],
  bankDetails: [emptyBank],
};

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<Customer>(initialFormState);

  const fetchCustomers = async () => {
    const res = await axios.get("http://localhost:8000/customers");
    setCustomers(res.data);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/category");
      const names = response.data.map((c: any) => c.categoryName);
      setCategories(names);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCustomers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    index?: number,
    type?: string
  ) => {
    const { name, value } = e.target;

    if (type === "contact" && index !== undefined) {
      const updated = formData.contacts.map((c, i) =>
        i === index ? { ...c, [name]: value } : c
      );
      setFormData((prev) => ({ ...prev, contacts: updated }));
    } else if (type === "bank" && index !== undefined) {
      const updated = formData.bankDetails.map((b, i) =>
        i === index ? { ...b, [name]: value } : b
      );
      setFormData((prev) => ({ ...prev, bankDetails: updated }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addContact = () =>
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { ...emptyContact }],
    }));

  const removeContact = (index: number) => {
    const updated = [...formData.contacts];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, contacts: updated }));
  };

  const addBank = () =>
    setFormData((prev) => ({
      ...prev,
      bankDetails: [...prev.bankDetails, { ...emptyBank }],
    }));
  const removeBank = (index: number) => {
    const updated = [...formData.bankDetails];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, bankDetails: updated }));
  };

  const handleEdit = (customer: Customer) => {
    setFormData(customer);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8000/customers/${id}`);
      alert("Vendor deleted successfully!");
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Failed to delete customer.");
    }
  };

  const handleCreate = async () => {
    const required = [
      "customerId",
      "customerName",
      "registerAddress",
      "gstNo",
      "contactName",
      "contactNumber",
      "emailId",
      "website",
      "remark",
      "creditTerms",
      "creditLimit",
    ];

    const missing = required.filter(
      (f) => !formData[f as keyof Customer]?.toString().trim()
    );
    if (missing.length > 0) {
      alert(`Missing fields: ${missing.join(", ")}`);
      return;
    }

    const validContacts = formData.contacts.filter(
      (c) =>
        c.firstName.trim() || c.lastName.trim() || c.contactPhoneNumber.trim()
    );
    const validBanks = formData.bankDetails.filter(
      (b) => b.accountNumber.trim() || b.ifscCode.trim() || b.bankName.trim()
    );

    if (validContacts.length === 0) {
      alert("Add at least one valid contact.");
      return;
    }
    if (validBanks.length === 0) {
      alert("Add at least one valid bank detail.");
      return;
    }

    try {
      if (formData.id) {
        await axios.put(`http://localhost:8000/customers/${formData.id}`, {
          ...formData,
          contacts: validContacts,
          bankDetails: validBanks,
        });
      } else {
        await axios.post("http://localhost:8000/customers", {
          ...formData,
          contacts: validContacts,
          bankDetails: validBanks,
        });
      }

      alert(
        formData.id
          ? "Customer updated successfully!"
          : "Customer created successfully!"
      );
      setFormData(initialFormState);
      setIsCreateModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error("Error creating customer:", err);
      alert("Failed to create customer. Please try again.");
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto lg:ml-72">
      <div className="flex justify-between items-center mb-5 mt-16">
      <button
  onClick={() => {
    setFormData(initialFormState); // ← Reset here
    setIsCreateModalOpen(true);
  }}

          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Customer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-center border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Customer ID</th>
              <th className="p-2 border">Customer Name</th>
              <th className="p-2 border">Contacts</th>
              <th className="p-2 border">Products</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id} className="border-b">
                <td className="p-2 border">{cust.customerCode}</td>
                <td className="p-2 border">{cust.customerName}</td>
                <td className="p-2 border">
                  {cust.contacts
                    .map((c) => `${c.firstName} ${c.lastName}`)
                    .join(", ")}
                </td>
                <td className="p-2 border  text-red-800">
                  {Array.isArray(cust.products)
                    ? cust.products.map((p) => p).join(", ")
                    : ""}
                </td>
                <td className="p-2 border flex justify-center gap-3 items-center">
                  <button
                    onClick={() => handleEdit(cust)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <PencilLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cust.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
  <div className="fixed inset-0 ml-48 mt-20  bg-gray bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden">
      <div className="overflow-auto max-h-[90vh]">
        <div className="min-w-[800px] p-6">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
            {formData.id ? "Edit Customer" : "Create Customer"}
          </h3>

          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "customerId",
              "customerName",
              "registerAddress",
              "gstNo",
              "contactName",
              "contactNumber",
              "emailId",
              "website",
              "creditTerms",
              "creditLimit",
              "remark",
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={(formData as any)[field]}
                onChange={(e) => handleInputChange(e, field)}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          {/* Products */}
          {/* <div className="mt-4">
  <label className="font-semibold block mb-2">GST Certificate (PDF)</label>
  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        setGstPdfFile(file);
      } else {
        alert("Please upload a valid PDF file.");
      }
    }}
    className="block w-full border p-2 rounded"
  />
  {gstPdfFile && (
    <p className="text-sm text-green-700 mt-1">{gstPdfFile.name}</p>
  )}
</div> */}

<div className="mt-6">
  <label className="font-semibold block mb-2">Products</label>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {categories.map((category) => (
      <label key={category} className="inline-flex items-center">
        <input
          type="checkbox"
          value={category}
          checked={formData.products.includes(category)}
          onChange={(e) => {
            const { checked, value } = e.target;
            setFormData((prev) => ({
              ...prev,
              products: checked
                ? [...prev.products, value]
                : prev.products.filter((p) => p !== value),
            }));
          }}
          className="mr-2"
        />
        <span>{category}</span>
      </label>
    ))}
  </div>
</div>


          {/* Contacts */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Contacts</h4>
              <button onClick={addContact} className="text-blue-600">
                <Plus size={20} />
              </button>
            </div>
            {formData.contacts.map((contact, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2 items-center"
              >
                {Object.keys(emptyContact).map((key) => (
                  <input
                    key={key}
                    name={key}
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    value={(contact as any)[key]}
                    onChange={(e) => handleInputChange(e, key, i, "contact")}
                    className="border p-2 rounded-lg"
                  />
                ))}
                <button
                  onClick={() => removeContact(i)}
                  className="text-red-600 font-bold"
                >
                  &minus;
                </button>
              </div>
            ))}
          </div>

          {/* Bank Details */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Bank Details</h4>
              <button onClick={addBank} className="text-blue-600">
                <Plus size={20} />
              </button>
            </div>
            {formData.bankDetails.map((bank, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2 items-center"
              >
                {Object.keys(emptyBank).map((key) => (
                  <input
                    key={key}
                    name={key}
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    value={(bank as any)[key]}
                    onChange={(e) => handleInputChange(e, key, i, "bank")}
                    className="border p-2 rounded-lg"
                  />
                ))}
                <button
                  onClick={() => removeBank(i)}
                  className="text-red-600 font-bold"
                >
                  &minus;
                </button>
              </div>
            ))}
          </div>

            <div className="flex justify-end gap-2 mt-6">
            <button
  onClick={() => {
    setIsCreateModalOpen(false);
    setFormData(initialFormState); // Reset on close
  }}
>
  Cancel
</button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {formData.id ? "Update" : "Save"}
              </button>
              </div>
        </div>
      </div>
    </div>
  </div>
      )}
    </div>
  );
};

export default CustomerTable;

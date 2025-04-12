"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilLine, Plus, Trash2 } from "lucide-react";

interface Inventory {
  id?: number;
  productId: number;
  serialNumber: string;
  macAddress: string;
  vendorId: number;
  purchaseDate: string;
  purchaseInvoice: string;
}

interface Vendor {
  id: number;
  vendorName: string;
}

interface Product {
  id: number;
  productName: string;
}

const initialFormState: Inventory = {
  productId: 0,
  serialNumber: "",
  macAddress: "",
  vendorId: 0,
  purchaseDate: "",
  purchaseInvoice: "",
};

const InventoryTable: React.FC = () => {
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Inventory>(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInventory = async () => {
    const res = await axios.get("http://localhost:8000/inventory");
    setInventoryList(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:8000/products");
    setProducts(res.data);
  };

  const fetchVendors = async () => {
    const res = await axios.get("http://localhost:8000/vendors");
    setVendors(res.data);
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
    fetchVendors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8000/inventory/${formData.id}`, formData);
        alert("Inventory updated!");
      } else {
        await axios.post("http://localhost:8000/inventory", formData);
        alert("Inventory created!");
      }
      setFormData(initialFormState);
      setIsModalOpen(false);
      fetchInventory();
    } catch (err) {
      console.error("Save error:", err);
      alert("Something went wrong!");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !confirm("Delete this inventory item?")) return;
    await axios.delete(`http://localhost:8000/inventory/${id}`);
    fetchInventory();
  };

  const openModal = (data?: Inventory) => {
    setFormData(data || initialFormState);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 p-6 overflow-auto lg:ml-72">
      <div className="flex justify-between items-center mb-5 mt-16">
        <h2 className="text-xl font-semibold">Inventory</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Inventory
        </button>
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-center border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            
          <tr>
            <th className="border p-2">Product</th>
            <th className="border p-2">Serial Number</th>
            <th className="border p-2">MAC</th>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Purchase Date</th>
            <th className="border p-2">Invoice</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryList.map((inv) => (
            <tr key={inv.id} className="text-center border-b">
              <td className="border p-2">{products.find(p => p.id === inv.productId)?.productName || "N/A"}</td>
              <td className="border p-2">{inv.serialNumber}</td>
              <td className="border p-2">{inv.macAddress}</td>
              <td className="border p-2">{vendors.find(v => v.id === inv.vendorId)?.vendorName || "N/A"}</td>
              <td className="border p-2">{inv.purchaseDate.slice(0, 10)}</td>
              <td className="border p-2">{inv.purchaseInvoice}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button onClick={() => openModal(inv)} className="text-blue-600">
                  <PencilLine size={18} />
                </button>
                <button onClick={() => handleDelete(inv.id)} className="text-red-600">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h3 className="text-lg font-bold mb-4">
              {formData.id ? "Edit Inventory" : "Add Inventory"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="productId" value={formData.productId} onChange={handleChange} className="border p-2 rounded">
                <option value={0}>Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productName}
                  </option>
                ))}
              </select>

              <select name="vendorId" value={formData.vendorId} onChange={handleChange} className="border p-2 rounded">
                <option value={0}>Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vendorName}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="serialNumber"
                placeholder="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="macAddress"
                placeholder="MAC Address"
                value={formData.macAddress}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="purchaseInvoice"
                placeholder="Purchase Invoice"
                value={formData.purchaseInvoice}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-300">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">
                {formData.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;

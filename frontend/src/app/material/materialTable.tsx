"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Vendor {
  id: number;
  vendorName: string;
}

interface Customer {
  id: number;
  customerName: string;
}

interface Product {
  id: number;
  productName: string;
}

interface InventoryItem {
  id: number;
  serialNumber: string;
  macAddress: string;
  productId: number;
  product: Product;  
  vendorId: number;
  vendor: Vendor;   
}

interface FormData {
  id?: number;
  deliveryType: string;
  refNumber?: string;
  customerId?: number;
  productId?: number;
  inventoryId?: number;
  vendorId?: number;
}

interface DeliveryItem {
  serialNumber: string;
  macAddress: string;
  productId: number;
  inventoryId?: number;
}

const initialFormData: FormData = {
  deliveryType: "",
  refNumber: "",
  customerId: 0,
  vendorId: 0,
};

const MaterialDeliveryForm: React.FC = () => {
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [items, setItems] = useState<DeliveryItem[]>([{ serialNumber: "", macAddress: "", productId: 0 }]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryList, setDeliveryList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSaleOrDemo = formData.deliveryType === "Sale" || formData.deliveryType === "Demo";
  const isPurchaseReturn = formData.deliveryType === "Purchase Return";

  useEffect(() => {
    axios.get("http://localhost:8000/customers").then((res) => setCustomers(res.data));
    axios.get("http://localhost:8000/vendors").then((res) => setVendors(res.data));
    axios.get("http://localhost:8000/products").then((res) => setProducts(res.data));
    axios.get("http://localhost:8000/inventory").then((res) => setInventory(res.data));
    fetchDeliveries(); // Fetch deliveries on component mount
  }, []);

  useEffect(() => {
    // Fetching inventory with associated product and vendor data
    axios.get("http://localhost:8000/inventory").then((res) => {
      setInventoryList(res.data); // Ensure your backend sends product and vendor data
    });
  }, []);

  const fetchDeliveries = async () => {
    const res = await axios.get("http://localhost:8000/material-delivery");
    setDeliveryList(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'customerId' || name === 'vendorId' ? parseInt(value) : value, // Convert to integer if the name is 'customerId' or 'vendorId'
    }));
  };
  

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
  
      const inventoryItem =
        name === "serialNumber"
          ? inventory.find((inv) => inv.serialNumber === value)
          : inventory.find((inv) => inv.macAddress === value);
  
      if (inventoryItem) {
        updated[index] = {
          ...updated[index],
          serialNumber: inventoryItem.serialNumber,
          macAddress: inventoryItem.macAddress,
          productId: inventoryItem.productId,
          inventoryId: inventoryItem.id, // Set inventoryId
        };
      }
  
      return updated;
    });
  };
  

  const addItem = () => {
    setItems([...items, { serialNumber: "", macAddress: "", productId: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const isEdit = !!formData.id;
  
    const payload = {
      ...formData,
      customerId: isSaleOrDemo ? formData.customerId : undefined,
      vendorId: isPurchaseReturn ? formData.vendorId : undefined,
      items,
    };
    
  
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8000/material-delivery/${formData.id}`, payload);
        alert("Delivery updated!");
      } else {
        await axios.post("http://localhost:8000/material-delivery", payload);
        alert("Delivery created!");
      }
  
      setFormData(initialFormData);
      setItems([{ serialNumber: "", macAddress: "", productId: 0 }]);
      fetchDeliveries();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving delivery");
    }
  };
  

  const openModal = (delivery?: any) => {
    if (delivery) {
      const enrichedItems = (delivery.items || []).map((item: any) => {
        const inventoryItem = inventoryList.find(inv => inv.id === item.inventoryId);
        return {
          serialNumber: inventoryItem?.serialNumber || "",
          macAddress: inventoryItem?.macAddress || "",
          productId: inventoryItem?.productId || 0,
          inventoryId: item.inventoryId,
        };
      });
  
      setFormData({
        id: delivery.id,
        deliveryType: delivery.deliveryType,
        refNumber: delivery.refNumber,
        customerId: delivery.customerId || 0,
        vendorId: delivery.vendorId || 0,
      });
      
      setTimeout(() => {
        setItems(enrichedItems);
      }, 0);
      
      setItems(enrichedItems);
    } else {
      setFormData(initialFormData);
      setItems([{ serialNumber: "", macAddress: "", productId: 0 }]);
    }
    setIsModalOpen(true);
  };
  

  

  const handleDelete = (id: any): void => {
    if (confirm("Are you sure you want to delete this delivery?")) {
      axios
        .delete(`http://localhost:8000/material-delivery/${id}`)
        .then(() => {
          alert("Delivery deleted!");
          fetchDeliveries(); // Refresh deliveries list after deletion
        })
        .catch((error) => {
          console.error(error);
          alert("Error deleting delivery");
        });
    }
  };

  

  return (
    <>
  <div className="flex-1 p-6 overflow-auto lg:ml-72">
  <div className="flex justify-between items-center mb-5 mt-16">        <h2 className="text-xl font-semibold">Material Deliveries</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Delivery
        </button>
      </div>

      <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-center border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Delivery Type</th>
                <th className="border p-2">Delivery Challan</th>
                <th className="border p-2">Ref Number</th>
                <th className="border p-2">Customer Name</th>
                <th className="border p-2">Vendor Name</th>
                <th className="border p-2">Serial Number</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">MAC Address</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
  {deliveryList.map((delivery) => {
    const inv = delivery.inventory; // Directly use the inventory object from delivery
    const product = inv?.product;
    return (
      <tr key={delivery.id}>
        <td className="border p-2">{delivery.deliveryType}</td>
        <td className="border p-2">{delivery.deliveryChallan}</td>
        <td className="border p-2">{delivery.refNumber}</td>
        <td className="border p-2">{delivery.customer?.customerName || "-"}</td>
        <td className="border p-2">
          {delivery.vendor?.vendorName || "-"}
        </td>
        <td className="border p-2">{inv?.serialNumber || "-"}</td>
        <td className="border p-2">{product?.productName || "-"}</td>
        <td className="border p-2">{inv?.macAddress || "-"}</td>
        <td className="border p-2">
          <button onClick={() => openModal(delivery)} className="text-blue-600">Edit</button>
          <button onClick={() => handleDelete(delivery.id)} className="text-red-600 ml-2">Delete</button>
        </td>
      </tr>
    );
  })}
</tbody>


          </table>
        </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h3 className="text-lg font-bold mb-4">{formData.id ? "Edit Delivery" : "Add Delivery"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="deliveryType" value={formData.deliveryType} onChange={handleChange} className="border p-2 rounded">
                <option value="">Select Delivery Type</option>
                <option value="Sale">Sale</option>
                <option value="Demo">Demo</option>
                <option value="Purchase Return">Purchase Return</option>
              </select>

              <input
                type="text"
                name="refNumber"
                placeholder="Reference Number"
                value={formData.refNumber || ""}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              {isSaleOrDemo && (
                <select name="customerId" value={formData.customerId} onChange={handleChange} className="border p-2 rounded">
                  <option value={0}>Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.customerName}</option>
                  ))}
                </select>
              )}

              {isPurchaseReturn && (
                <select name="vendorId" value={formData.vendorId} onChange={handleChange} className="border p-2 rounded">
                  <option value={0}>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.vendorName}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="mt-6">
              <label className="font-medium mb-2 block">Items</label>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2 items-center">
                  <input
                    type="text"
                    name="serialNumber"
                    placeholder="Serial No."
                    value={item.serialNumber}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="macAddress"
                    placeholder="MAC Address"
                    value={item.macAddress}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    readOnly
                    value={products.find((p) => p.id === item.productId)?.productName || ""}
                    placeholder="Product Name"
                    className="border p-2 rounded bg-gray-100 text-gray-800"
                  />
                  <button onClick={addItem} className="text-green-600 font-bold text-xl">+</button>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(index)} className="text-red-600 font-bold text-xl">−</button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">
                {formData.id ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MaterialDeliveryForm;

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

interface FormData {
  id?: number;
  deliveryType: string;
  refNumber?: string;
  customerId?: number;
  vendorId?: number;
}

interface DeliveryItem {
  serialNumber: string;
  macAddress: string;
  productId: number;
}

const initialFormData: FormData = {
  deliveryType: "",
  refNumber: "",
  customerId: 0,
  vendorId: 0,
};

const MaterialDeliveryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [items, setItems] = useState<DeliveryItem[]>([
    { serialNumber: "", macAddress: "", productId: 0 },
  ]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const isSaleOrDemo = formData.deliveryType === "Sale" || formData.deliveryType === "Demo";
  const isPurchaseReturn = formData.deliveryType === "Purchase Return";

  useEffect(() => {
    axios.get("http://localhost:8000/customers").then((res) => setCustomers(res.data));
    axios.get("http://localhost:8000/vendors").then((res) => setVendors(res.data));
    axios.get("http://localhost:8000/products").then((res) => setProducts(res.data));
  }, []);

  // Function to fetch inventory details based on serialNumber or macAddress
  const fetchInventoryDetails = async (serialNumber: string, macAddress: string) => {
    try {
      let queryParam = serialNumber ? `serialNumber=${serialNumber}` : `macAddress=${macAddress}`;
      const res = await axios.get(`http://localhost:8000/inventory?${queryParam}`);
      const inventoryItem = res.data[0]; // Assuming the API returns an array
      if (inventoryItem) {
        return {
          productId: inventoryItem.product.id,
          serialNumber: inventoryItem.serialNumber,
          macAddress: inventoryItem.macAddress,
        };
      }
    } catch (error) {
      console.error("Error fetching inventory details:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "serialNumber" || name === "macAddress") {
      const otherField = name === "serialNumber" ? "macAddress" : "serialNumber";
      const item = items[index];
      const newItem = { ...item, [name]: value };

      // Fetch details if serial or mac address is changed
      fetchInventoryDetails(newItem.serialNumber, newItem.macAddress).then((details) => {
        if (details) {
          setItems((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              productId: details.productId,
              serialNumber: details.serialNumber || "",
              macAddress: details.macAddress || "",
            };
            return updated;
          });
        }
      });
    } else {
      setItems((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [name]: name === "productId" ? parseInt(value) : value,
        };
        return updated;
      });
    }
  };

  const addItem = () => {
    setItems([...items, { serialNumber: "", macAddress: "", productId: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData, items };
      await axios.post("http://localhost:8000/delivery", payload);
      alert("Delivery saved!");
      setFormData(initialFormData);
      setItems([{ serialNumber: "", macAddress: "", productId: 0 }]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving delivery");
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
            <h3 className="text-lg font-bold mb-4">{formData.id ? "Edit Delivery" : "Add Delivery"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleChange}
                className="border p-2 rounded"
              >
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
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value={0}>Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customerName}
                    </option>
                  ))}
                </select>
              )}

              {isPurchaseReturn && (
                <select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value={0}>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vendorName}
                    </option>
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
                  <select
                    name="productId"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border p-2 rounded"
                  >
                    <option value={0}>Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.productName}
                      </option>
                    ))}
                  </select>
                  <button onClick={addItem} className="text-green-600 font-bold text-xl">
                    +
                  </button>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(index)} className="text-red-600 font-bold text-xl">
                      −
                    </button>
                  )}
                </div>
              ))}
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
    </>
  );
};

export default MaterialDeliveryForm;

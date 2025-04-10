"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Department {
  id: number;
  departmentName: string;
}

interface Service {
  id: number;
  serviceName: string;
  serviceDescription: string;
  SAC: string;
  departmentId: number;
  serviceCategoryId: number;
  serviceSubCategoryId: number;
}

interface Category {
  id: number;
  categoryName: string;
  subCategories: { id: number; subCategoryName: string }[];
}

const ServiceTable: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category["subCategories"]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [serviceSubCategoryId, setServiceSubCategoryId] = useState("");
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    SAC: "",
    departmentId: 0,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [serviceRes, departmentRes, categoryRes] = await Promise.all([
        axios.get("http://localhost:8000/service"),
        axios.get("http://localhost:8000/departments"),
        axios.get("http://localhost:8000/category"),
      ]);
      setServices(serviceRes.data.reverse());
      setDepartments(departmentRes.data);
      setCategories(categoryRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);
    setSubCategories(
      categories.find((cat) => cat.id.toString() === selectedCategoryId)?.subCategories || []
    );
    setServiceSubCategoryId("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: name === "departmentId" ? +value : value }));
  };

  const handleCreateOrUpdate = async (isUpdate: boolean) => {
    try {
      const serviceData = { ...formData, serviceCategoryId: +categoryId, serviceSubCategoryId: +serviceSubCategoryId };
      if (isUpdate && selectedService) {
        await axios.put(`http://localhost:8000/service/${selectedService.id}`, serviceData);
      } else {
        await axios.post("http://localhost:8000/service", serviceData);
      }
      alert(`Service ${isUpdate ? "updated" : "added"} successfully!`);
      setIsCreateModalOpen(false);
      setIsUpdateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(`Error ${isUpdate ? "updating" : "adding"} service:`, error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:8000/service/${id}`);
        alert("Service deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Service
      </button>
      <table className="w-full text-center border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Service Name</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">SAC</th>
            <th className="border border-gray-300 px-4 py-2">Department</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{service.serviceName}</td>
              <td className="border px-4 py-2">{service.serviceDescription}</td>
              <td className="border px-4 py-2">{service.SAC}</td>
              <td className="border px-4 py-2">{departments.find((dept) => dept.id === service.departmentId)?.departmentName || "N/A"}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setFormData({
                      serviceName: service.serviceName,
                      serviceDescription: service.serviceDescription,
                      SAC: service.SAC,
                      departmentId: service.departmentId,
                    });
                    setCategoryId(service.serviceCategoryId.toString());
                    setServiceSubCategoryId(service.serviceSubCategoryId.toString());
                    setIsUpdateModalOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
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
  );
};

export default ServiceTable;

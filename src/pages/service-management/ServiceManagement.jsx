import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import { FiSearch, FiEdit2, FiTrash2, FiFilter, FiEye } from "react-icons/fi";
import { MdAdd } from "react-icons/md";
import Button from "../../components/Button";

const ServiceManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("services");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({ show: false, type: '', name: '' });

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
  };

  // Mock data for services
  const mockServices = [
    {
      id: 1,
      name: "Plumbing Service",
      category: "Home Services",
      createdDate: "2024-08-03T11:30:00",
      status: "Active",
    },
    {
      id: 2,
      name: "Electrical Repair",
      category: "Home Services",
      createdDate: "2024-08-02T09:15:00",
      status: "Active",
    },
    {
      id: 3,
      name: "House Cleaning",
      category: "Cleaning",
      createdDate: "2024-08-01T14:45:00",
      status: "Active",
    },
    {
      id: 4,
      name: "Gardening",
      category: "Outdoor",
      createdDate: "2024-07-31T16:20:00",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Car Wash",
      category: "Automotive",
      createdDate: "2024-07-30T10:00:00",
      status: "Active",
    },
    {
      id: 6,
      name: "Painting",
      category: "Home Services",
      createdDate: "2024-07-29T13:30:00",
      status: "Active",
    },
    {
      id: 7,
      name: "Moving Service",
      category: "Transportation",
      createdDate: "2024-07-28T08:45:00",
      status: "Active",
    },
    {
      id: 8,
      name: "Pest Control",
      category: "Home Services",
      createdDate: "2024-07-27T15:10:00",
      status: "Active",
    },
    {
      id: 9,
      name: "AC Repair",
      category: "Home Services",
      createdDate: "2024-07-26T11:55:00",
      status: "Active",
    },
    {
      id: 10,
      name: "Catering",
      category: "Food Services",
      createdDate: "2024-07-25T12:30:00",
      status: "Active",
    },
    {
      id: 11,
      name: "Photography",
      category: "Creative",
      createdDate: "2024-07-24T09:20:00",
      status: "Active",
    },
    {
      id: 12,
      name: "Web Development",
      category: "Technology",
      createdDate: "2024-07-23T14:00:00",
      status: "Active",
    },
    {
      id: 13,
      name: "Personal Training",
      category: "Health & Fitness",
      createdDate: "2024-07-22T07:30:00",
      status: "Active",
    },
    {
      id: 14,
      name: "Tutoring",
      category: "Education",
      createdDate: "2024-07-21T16:45:00",
      status: "Active",
    },
    {
      id: 15,
      name: "Event Planning",
      category: "Events",
      createdDate: "2024-07-20T10:15:00",
      status: "Active",
    },
    {
      id: 16,
      name: "Beauty Salon",
      category: "Personal Care",
      createdDate: "2024-07-19T13:00:00",
      status: "Active",
    },
    {
      id: 17,
      name: "Pet Grooming",
      category: "Pet Services",
      createdDate: "2024-07-18T11:40:00",
      status: "Active",
    },
    {
      id: 18,
      name: "Laundry Service",
      category: "Home Services",
      createdDate: "2024-07-17T15:25:00",
      status: "Active",
    },
    {
      id: 19,
      name: "Handyman",
      category: "Home Services",
      createdDate: "2024-07-16T08:50:00",
      status: "Active",
    },
    {
      id: 20,
      name: "Landscaping",
      category: "Outdoor",
      createdDate: "2024-07-15T12:10:00",
      status: "Active",
    },
  ];

  // Mock data for categories
  const mockCategories = [
    { id: 1, name: "Home Services", createdDate: "2024-01-15", serviceCount: 8, status: "Active" },
    { id: 2, name: "Cleaning", createdDate: "2024-01-16", serviceCount: 3, status: "Active" },
    { id: 3, name: "Outdoor", createdDate: "2024-01-17", serviceCount: 2, status: "Active" },
    { id: 4, name: "Automotive", createdDate: "2024-01-18", serviceCount: 1, status: "Active" },
    { id: 5, name: "Transportation", createdDate: "2024-01-19", serviceCount: 1, status: "Active" },
    { id: 6, name: "Food Services", createdDate: "2024-01-20", serviceCount: 1, status: "Active" },
    { id: 7, name: "Creative", createdDate: "2024-01-21", serviceCount: 1, status: "Active" },
    { id: 8, name: "Technology", createdDate: "2024-01-22", serviceCount: 1, status: "Active" },
    { id: 9, name: "Health & Fitness", createdDate: "2024-01-23", serviceCount: 1, status: "Active" },
    { id: 10, name: "Education", createdDate: "2024-01-24", serviceCount: 1, status: "Active" },
    { id: 11, name: "Events", createdDate: "2024-01-25", serviceCount: 1, status: "Active" },
    { id: 12, name: "Personal Care", createdDate: "2024-01-26", serviceCount: 1, status: "Active" },
    { id: 13, name: "Pet Services", createdDate: "2024-01-27", serviceCount: 1, status: "Active" },
  ];

  useEffect(() => {
    setServices(mockServices);
    setCategories(mockCategories);
  }, []);

  const itemsPerPage = 20;
  const totalItems = activeTab === "services" ? services.length : categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredData = (activeTab === "services" ? services : categories).filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (id) => {
    const service = services.find(s => s.id === id);
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const handleEdit = (id) => {
    console.log("Edit item:", id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id) => {
    setServiceToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Delete confirmed for service:", serviceToDeleteId);
    // TODO: Implement actual delete functionality
    setIsDeleteModalOpen(false);
    setServiceToDeleteId(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setServiceToDeleteId(null);
  };

  const handleCreateService = () => {
    setIsCreateServiceModalOpen(true);
  };

  const handleCreateServiceSubmit = () => {
    console.log("Create service submitted");
    // TODO: Implement create service functionality
    setIsCreateServiceModalOpen(false);
    setSuccessModal({ show: true, type: 'service', name: 'Service' });
  };

  const cancelCreateService = () => {
    setIsCreateServiceModalOpen(false);
  };

  const handleCreateCategory = () => {
    setIsCreateCategoryModalOpen(true);
  };

  const handleCreateCategorySubmit = () => {
    console.log("Create category submitted");
    // TODO: Implement create category functionality
    setIsCreateCategoryModalOpen(false);
    setSuccessModal({ show: true, type: 'category', name: 'Category' });
  };

  const cancelCreateCategory = () => {
    setIsCreateCategoryModalOpen(false);
  };

  const closeSuccessModal = () => {
    setSuccessModal({ show: false, type: '', name: '' });
  };

  return (
    <MainLayout title="Service Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* <h1 className="text-2xl font-bold text-gray-900">Service Management</h1> */}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons and Toggle Buttons
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-700">Service List</h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleCreateCategory}
                className="flex items-center gap-2 border-2 border-[#EC613D] text-[#EC613D] bg-white hover:bg-[#EC613D] hover:text-white rounded-lg"
              >
                <MdAdd className="text-lg" />
                Create Category
              </Button>
              <Button
                onClick={handleCreateService}
                className="flex items-center gap-2 bg-[#EC613D] text-white border-2 border-[#EC613D] hover:bg-[#D4542F] rounded-lg"
              >
                <MdAdd className="text-lg" />
                Create Service
              </Button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "services"
                    ? "bg-[#EC613D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("category")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "category"
                    ? "bg-[#EC613D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Category
              </button>
              <button 
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-[#EC613D] hover:text-white"
                onClick={() => console.log("Filter clicked")}
              >
                <FiFilter className="text-lg" />
              </button>
            </div>
          </div>
        </div> */}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Action Buttons and Toggle Buttons */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-700">
              {activeTab === "services" ? "Service List" : "Category List"}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleCreateCategory}
                className="flex items-center gap-2 border-2 border-[#EC613D] text-[#EC613D] bg-white hover:bg-[#EC613D] hover:text-white rounded-lg"
              >
                <MdAdd className="text-lg" />
                Create Category
              </Button>
              <Button
                onClick={handleCreateService}
                className="flex items-center gap-2 bg-[#EC613D] text-white border-2 border-[#EC613D] hover:bg-[#D4542F] rounded-lg"
              >
                <MdAdd className="text-lg" />
                Create Service
              </Button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "services"
                    ? "bg-[#EC613D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("category")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "category"
                    ? "bg-[#EC613D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Category
              </button>
              <button 
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-[#EC613D] hover:text-white"
                onClick={() => console.log("Filter clicked")}
              >
                <FiFilter className="text-lg" />
              </button>
            </div>
          </div>
        </div>
          <div className="min-w-full overflow-hidden sm:rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === "services" ? "Service Name" : "Category Name"}
                  </th>
                  {activeTab === "services" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    {activeTab === "services" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-medium ${
                        item.status === "Active" ? "text-green-500" : "text-red-500"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(item.id)}
                          className="w-8 h-8 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center transition-colors"
                        >
                          <FiEye className="text-yellow-600 text-sm" />
                        </button>
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                        >
                          <FiEdit2 className="text-red-600 text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                        >
                          <FiTrash2 className="text-red-600 text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? "bg-[#EC613D] text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {isViewModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Service Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between py-2">
                <span className="font-medium">Service Name</span>
                <span>{selectedService.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Category</span>
                <span>{selectedService.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Status</span>
                <span className={`font-semibold ${selectedService.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                  {selectedService.status}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Created On</span>
                <span>{formatDate(selectedService.createdDate)}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => console.log("Remove Service clicked")}
                className="px-4 py-2 border border-red-500 text-red-500 bg-white hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                Remove Service
              </Button>
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedService.id);
                }}
                className="px-4 py-2 bg-[#EC613D] text-white rounded-lg hover:bg-[#D4542F]"
              >
                Edit Service
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Service?</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 text-center">
                Are you sure you want to delete this service? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="px-4 py-2 bg-[#EC613D] text-white hover:bg-[#D4542F]"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Service Modal */}
      {isCreateServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Service</h3>
              <button
                onClick={cancelCreateService}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="Enter service name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white">
                      <option value="">Select category</option>
                      <option value="Home Services">Home Services</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Transportation">Transportation</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Status</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white">
                      <option value="Active">Active</option>
                      <option value="Deactivated">Deactivated</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  rows="4"
                  placeholder="Enter service description"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Service Logo</label>
                <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input type="file" className="hidden" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={cancelCreateService}
                className="px-4 py-2 border border-[#EC613D] text-[#EC613D] bg-white hover:bg-[#EC613D] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateServiceSubmit}
                className="px-4 py-2 bg-[#EC613D] text-white hover:bg-[#D4542F]"
              >
                Create Service
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Category Modal */}
      {isCreateCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Category</h3>
              <button
                onClick={cancelCreateCategory}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service Type</label>
                <div className="relative">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white">
                    <option value="">Select service type</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Transportation">Transportation</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Service Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  rows="4"
                  placeholder="Enter service description"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Category Logo</label>
                <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input type="file" className="hidden" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={cancelCreateCategory}
                className="px-4 py-2 border border-[#EC613D] text-[#EC613D] bg-white hover:bg-[#EC613D] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategorySubmit}
                className="px-4 py-2 bg-[#EC613D] text-white hover:bg-[#D4542F]"
              >
                Create Category
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {successModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 text-center relative">
            <button
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {successModal.name} Created Successfully!
            </h3>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ServiceManagement;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../../layouts/MainLayout";
import { FiSearch, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

const SubscriptionManagement = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  
  // New modal state
  const [planName, setPlanName] = useState("");
  const [planDuration, setPlanDuration] = useState("Monthly");
  const [planPrice, setPlanPrice] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [applicableUser, setApplicableUser] = useState("All");

  // Mock data for subscription plans
  const mockSubscriptions = [
    {
      id: 1,
      planName: "Monthly",
      duration: "30 days",
      features: [
        "Apply to service requests",
        "Profile visibility in search",
        "Customer chat access",
        "Earnings dashboard"
      ],
      price: "P200",
      applicableUser: "All"
    },
    {
      id: 2,
      planName: "Quarterly",
      duration: "90 days",
      features: [
        "Apply to service requests",
        "Profile visibility in search",
        "Customer chat access",
        "Earnings dashboard"
      ],
      price: "P500",
      applicableUser: "Professional"
    },
    {
      id: 3,
      planName: "Annual",
      duration: "365 days",
      features: [
        "Apply to service requests",
        "Profile visibility in search",
        "Customer chat access",
        "Earnings dashboard"
      ],
      price: "P2000",
      applicableUser: "Customer Business"
    }
  ];

  useEffect(() => {
    setSubscriptions(mockSubscriptions);
  }, []);

  const itemsPerPage = 10;
  const filteredData = subscriptions.filter(
    (item) =>
      item.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicableUser.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    // Reset form fields
    setPlanName("");
    setPlanDuration("Monthly");
    setPlanPrice("");
    setFeatures([]);
    setFeatureInput("");
    setApplicableUser("All");
    setIsCreateModalOpen(true);
  };

  const handleAddFeature = (e) => {
    if (e.key === "Enter" && featureInput.trim()) {
      e.preventDefault();
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (indexToRemove) => {
    setFeatures(features.filter((_, index) => index !== indexToRemove));
  };

  const handleCreateSubmit = () => {
    console.log("Create subscription submitted:", {
      planName,
      planDuration,
      planPrice,
      features,
      applicableUser
    });
    // TODO: Implement actual create functionality
    setIsCreateModalOpen(false);
  };

  const handleView = (subscription) => {
    setSelectedSubscription(subscription);
    setIsViewModalOpen(true);
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleDelete = (subscription) => {
    setSubscriptionToDelete(subscription);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Delete confirmed for subscription:", subscriptionToDelete?.id);
    // TODO: Implement actual delete functionality
    setIsDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  };

  const handleEditSubmit = () => {
    console.log("Edit subscription submitted");
    // TODO: Implement edit functionality
    setIsEditModalOpen(false);
    setSelectedSubscription(null);
  };

  return (
    <MainLayout title="Subscription Management">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscription plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
            />
          </div>
        </div>

        {/* Subscription Plans Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">Subscription Plans</h2>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-[#EC613D] text-white border-2 border-[#EC613D] hover:bg-[#D4542F] rounded-lg text-sm font-medium transition-colors"
              >
                <MdAdd className="text-lg" />
                Create Plan
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicable User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscription.planName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.duration}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="space-y-1">
                        {subscription.features.map((feature, index) => (
                          <li key={index} className="text-xs">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subscription.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.applicableUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(subscription)}
                          className="w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-colors"
                        >
                          <FiEye className="text-orange-600 text-sm" />
                        </button>
                        <button
                          onClick={() => handleEdit(subscription)}
                          className="w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200 flex items-center justify-center transition-colors"
                        >
                          <FiEdit2 className="text-orange-600 text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(subscription)}
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
        {totalPages > 1 && (
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
                        ? "bg-[#214C65] text-white"
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
        )}
      </div>

      {/* Create Plan Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Plan</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="Enter plan name"
                />
              </div>

              {/* Plan Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Duration</label>
                <div className="relative">
                  <select
                    value={planDuration}
                    onChange={(e) => setPlanDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Plan Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Price</label>
                <input
                  type="text"
                  value={planPrice}
                  onChange={(e) => setPlanPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="Enter price"
                />
              </div>

              {/* Add Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Features</label>
                <div className="space-y-2">
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {feature}
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleAddFeature}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                    placeholder="Type here and press enter"
                  />
                </div>
              </div>

              {/* Applicable User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable User</label>
                <div className="relative">
                  <select
                    value={applicableUser}
                    onChange={(e) => setApplicableUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white mb-3"
                  >
                    <option value="All">All</option>
                    <option value="Professional">Professional</option>
                    <option value="Professional Plus">Professional Plus</option>
                    <option value="Customer Business">Customer Business</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                className="px-6 py-2 bg-[#EC613D] text-white hover:bg-[#D4542F] rounded-lg font-medium transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {isEditModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Subscription Plan</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                  <input
                    type="text"
                    defaultValue={selectedSubscription.planName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#214C65] focus:border-transparent"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    defaultValue={selectedSubscription.duration}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#214C65] focus:border-transparent"
                    placeholder="e.g., 30 days"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    defaultValue={selectedSubscription.price}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#214C65] focus:border-transparent"
                    placeholder="e.g., P200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable User</label>
                  <div className="relative">
                    <select 
                      defaultValue={selectedSubscription.applicableUser}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="All">All</option>
                      <option value="Professional">Professional</option>
                      <option value="Professional Plus">Professional Plus</option>
                      <option value="Customer Business">Customer Business</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <textarea
                  defaultValue={selectedSubscription.features.join('\n')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#214C65] focus:border-transparent"
                  rows="4"
                  placeholder="Enter features (one per line)"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border-2 border-[#EC613D] text-[#EC613D] bg-white hover:bg-[#EC613D] hover:text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-[#EC613D] text-white border-2 border-[#EC613D] hover:bg-[#D4542F] rounded-lg font-medium transition-colors"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && subscriptionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Subscription Plan?</h3>
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
                Are you sure you want to delete the "{subscriptionToDelete.planName}" subscription plan? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Plan Modal */}
      {isViewModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Subscription Plan Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Plan Name</label>
                  <p className="text-gray-900 font-medium">{selectedSubscription.planName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                  <p className="text-gray-900 font-medium">{selectedSubscription.duration}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
                  <p className="text-gray-900 font-medium">{selectedSubscription.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Applicable User</label>
                  <p className="text-gray-900 font-medium">{selectedSubscription.applicableUser}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Features</label>
                <div className="space-y-2">
                  {selectedSubscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#EC613D] rounded-full"></div>
                      <span className="text-gray-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SubscriptionManagement;

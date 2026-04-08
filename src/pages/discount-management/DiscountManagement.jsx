import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { FiSearch, FiTrash2 } from "react-icons/fi";

const DiscountManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [discounts, setDiscounts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  
  // Form states
  const [couponCode, setCouponCode] = useState("");
  const [couponName, setCouponName] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [applicablePlan, setApplicablePlan] = useState("Monthly");
  const [applicableUser, setApplicableUser] = useState("Professional Plus");
  const [expiryDate, setExpiryDate] = useState("");

  // Mock data for discount coupons
  const mockDiscounts = [
    {
      id: 1,
      couponCode: "SAVE20",
      couponName: "Summer Offer",
      discount: "P20",
      discountType: "fixed",
      applicablePlan: "Monthly",
      applicableUser: "Professional Plus",
      expiryDate: "30 Jun 2026",
      status: "Active"
    },
    {
      id: 2,
      couponCode: "WELCOME10",
      couponName: "Welcome Discount",
      discount: "P10",
      discountType: "fixed",
      applicablePlan: "Quarterly",
      applicableUser: "Customer Business",
      expiryDate: "30 Jun 2026",
      status: "Expired"
    },
    {
      id: 3,
      couponCode: "WELCOME10",
      couponName: "Welcome Discount",
      discount: "10%",
      discountType: "percentage",
      applicablePlan: "Yearly",
      applicableUser: "Professional",
      expiryDate: "30 Jun 2026",
      status: "Active"
    },
    {
      id: 4,
      couponCode: "WELCOME10",
      couponName: "Welcome Discount",
      discount: "P10",
      discountType: "fixed",
      applicablePlan: "Quarterly",
      applicableUser: "Customer Business",
      expiryDate: "30 Jun 2026",
      status: "Expired"
    }
  ];

  useEffect(() => {
    setDiscounts(mockDiscounts);
  }, []);

  const itemsPerPage = 10;
  const filteredData = discounts.filter(
    (item) =>
      item.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.couponName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicablePlan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicableUser.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    // Reset form fields
    setCouponCode("");
    setCouponName("");
    setDiscount("");
    setDiscountType("percentage");
    setApplicablePlan("Monthly");
    setApplicableUser("Professional Plus");
    setExpiryDate("");
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = () => {
    console.log("Create discount submitted:", {
      couponCode,
      couponName,
      discount,
      discountType,
      applicablePlan,
      applicableUser,
      expiryDate
    });
    // TODO: Implement actual create functionality
    setIsCreateModalOpen(false);
  };

  const handleDelete = (discount) => {
    setDiscountToDelete(discount);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Delete confirmed for discount:", discountToDelete?.id);
    // TODO: Implement actual delete functionality
    setIsDeleteModalOpen(false);
    setDiscountToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDiscountToDelete(null);
  };

  return (
    <MainLayout title="Discount Management">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search discount coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
            />
          </div>
        </div>

        {/* Discount Coupons Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-700">Discount Coupons</h2>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#EC613D] text-white border-2 border-[#EC613D] hover:bg-[#D4542F] rounded-lg text-sm font-medium transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicable Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicable User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {discount.couponCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {discount.couponName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {discount.discount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {discount.applicablePlan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {discount.applicableUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {discount.expiryDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          discount.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {discount.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(discount)}
                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                      >
                        <FiTrash2 className="text-red-600 text-sm" />
                      </button>
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

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
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
              {/* Coupon Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Name</label>
                <input
                  type="text"
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="Enter coupon name"
                />
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="Enter coupon code"
                />
              </div>

              {/* Discount Type and Discount Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <div className="relative">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                    placeholder={discountType === "percentage" ? "20%" : "P20"}
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent"
                  placeholder="30 Jun 2026"
                />
              </div>

              {/* Applicable User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable User</label>
                <div className="relative">
                  <select
                    value={applicableUser}
                    onChange={(e) => setApplicableUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select a category</option>
                    <option value="Professional Plus">Professional Plus</option>
                    <option value="Professional">Professional</option>
                    <option value="Customer Business">Customer Business</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Applicable Plans */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Plans</label>
                <div className="relative">
                  <select
                    value={applicablePlan}
                    onChange={(e) => setApplicablePlan(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC613D] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
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
                className="px-6 py-2 border-2 border-red-500 text-red-500 bg-white hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubmit}
                className="px-6 py-2 bg-[#EC613D] text-white hover:bg-[#D4542F] rounded-lg font-medium transition-colors"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && discountToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Discount Coupon?</h3>
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
                Are you sure you want to delete the "{discountToDelete.couponCode}" coupon? This action cannot be undone.
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
    </MainLayout>
  );
};

export default DiscountManagement;

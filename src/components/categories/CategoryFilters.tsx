
import React from 'react';

export const CategoryFilters: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Filters</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range (৳)</h4>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      {/* Vendor Type */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Vendor Type</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Verified Vendors</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Top Rated</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">Local Vendors</span>
          </label>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Location</h4>
        <select className="w-full px-3 py-2 border rounded-lg text-sm">
          <option>All Bangladesh</option>
          <option>Dhaka</option>
          <option>Chittagong</option>
          <option>Sylhet</option>
          <option>Rajshahi</option>
          <option>Khulna</option>
          <option>Barisal</option>
          <option>Rangpur</option>
        </select>
      </div>
    </div>
  );
};
